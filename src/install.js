var path = require('path');
var Promise = require('bluebird');
var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var helpers = require('./helpers');
var vcsDir = argv._[0];
var VcsType = {
	Git: 'git',
	Hg: 'hg'
};
var hooks = ['pre-commit'];

var HOOKS_SOURCE_DIR = __dirname;
var HG_HOOKS_HEADER = '[hooks]';

// promisify
var fs = Promise.promisifyAll(require('fs'));
var fsExtra = Promise.promisifyAll(require('fs-extra'));

// because original fs.exists has not error-first interface and is deprecated,
// we need to make it's own implementation
fs.exists = function(path) {
  return fs.accessAsync(path)
    .then(function() {
      return true;
    })
    .catch(function() {
      return false;
    });
};

// Usage
var usage = 'Usage: vcs-hooks [vcs-directory]';

function UsageError(message, printUsage) {
  this.message = message;
  this.printUsage = printUsage || false;
}
UsageError.prototype = Object.create(Error.prototype);

function getVcsType(dir) {
  return Promise.resolve(path.join(dir, '.git'))
    .then(fs.exists)
    .then(function(isGit) {
      if(isGit) {
        return VcsType.Git;
      }

      return Promise.resolve(path.join(dir, '.hg'))
        .then(fs.exists)
        .then(function(isHg) {
          if (isHg) {
            return VcsType.Hg;
          }

          throw new UsageError('Unknown VCS type in directory \'' + vcsDir + '\'.');
        });
    });
}

// Hook manipulation
function getHookPath(hook /**: string */) {
  return path.join(HOOKS_SOURCE_DIR, hook);
}

function copyHook(hook, targetDir) {
  var hookPath = getHookPath(hook),
      hookTargetPath = path.join(targetDir, path.basename(hookPath));

  return fsExtra.copyAsync(hookPath, hookTargetPath)
    .then(function() {
      if (helpers.isWin) {
        return fsExtra.copyAsync(hookPath + '.bat', hookTargetPath + '.bat')
          .then(function() {
            return hookPath;
          });
      }

      return hookPath;
    });
}

function copyGitHook(hook, dir) {
  var hooksDir = path.join(dir, '.git/hooks');

  return copyHook(hook, hooksDir)
    .then(function(hookPath) {
      return fs.chmodAsync(path.join(hooksDir, path.basename(hookPath)), 777);
    });
}

function normalizeHookPath(path) {
    return helpers.isWin ? path.replace(/^\.\//, '').replace('/', '\\') : path;
}

function copyHgHook(hook, dir) {
  var hgDir = path.join(dir, '.hg'),
      hgrcFilePath = path.join(hgDir, 'hgrc'),
      hookRowWithHeader,
      hookLeading,
      hookRow;

  hookLeading = hook.replace('-', '') + ' = ';
  hookRow = hookLeading +  normalizeHookPath('./.hg/' + hook);
  hookRowWithHeader = HG_HOOKS_HEADER + '\n' + hookRow + '\n';

  return copyHook(hook, hgDir)
    .then(function() {
      return fs.exists(hgrcFilePath);
    })
    .then(function(hgrcExists) {
      if (!hgrcExists) {
        return fs.writeFileAsync(hgrcFilePath, hookRowWithHeader);
      }

      return fs.readFileAsync(hgrcFilePath, 'utf8')
        .then(function(content) {
          if (content.indexOf(HG_HOOKS_HEADER) === - 1) {
            content += '\n\n' + hookRowWithHeader;
          } else if (content.indexOf(hookLeading) === -1) {
            content = content.replace(HG_HOOKS_HEADER, hookRowWithHeader);
          } else {
            throw new UsageError('Hook \'' + hook +  '\' already exists in ' + hgrcFilePath + '.');
          }

          return fs.writeFileAsync(hgrcFilePath, content);
        });
    });
}

// Main
Promise
  .try(function() {
    if (!vcsDir) {
      throw new UsageError('VCS directory not defined!', true);
    }

    return vcsDir;
  })
  .then(fs.exists)
  .then(function(dirExists) {
    if (!dirExists) {
      throw new UsageError('Cannot find directory \'' + vcsDir + '\', check the path.');
    }

    return vcsDir;
  })
  .then(getVcsType)
  .then(function(type) {
    return Promise.map(hooks, function(hook) {
      if (type === VcsType.Git) {
        return copyGitHook(hook, vcsDir);
      } else if (type === VcsType.Hg) {
        return copyHgHook(hook, vcsDir);
      }
    });
  })
  .then(function() {
    process.stdout.write(chalk.green('\nHooks installed successfully into \'' + vcsDir + '\'.\n'));
    process.exit(0);
  })
  .catch(UsageError, function(err) {
    process.stderr.write('\n ' + chalk.red(err.message) + (err.printUsage ? '\n\n ' + chalk.blue(usage) : '') + '\n');
    process.exit(1);
  })
  .catch(function(err) {
    process.stderr.write(chalk.red(err.message));
    process.exit(1);
  });
