var assert = require('assert');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var rimraf = require('rimraf');

var hooksSrcPath = '.';

var execAndAssertError = function (command, successCallback) {
  exec(command, function(err) {
    assert.ifError(err);
    successCallback();
  });
};

var copyFile = function (filePath, copyTo, callback, fileModificator) {
  fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
    assert.ifError(err);

    if (fileModificator) {
      data = fileModificator(data);
    }

    fs.writeFile(copyTo + '/' + path.basename(filePath), data, function(err) {
      assert.ifError(err);

      callback();
    })
  });
};

// General utilities
function generateRandomDirName (vcsName) {
  var dir = vcsName + '_test' + new Date().getTime().toString() + Math.round((Math.random(100000) * 300)).toString();

  return './test/' + dir;
}

function destroyTmpRepository (repoDir, callback) {
  rimraf(repoDir, callback)
}

function getErrorMessage (forbiddenStatement) {
  return 'You forgot to remove a ' + forbiddenStatement + ' in the following files';
}

function copyFixtureIntoRepo (fixtureName, modificator, repoDir, callback) {
  copyFile('./test/fixtures/' + fixtureName, repoDir, callback, modificator);
}

// Git specific utilities
var GitHelpers = {
  createTmpRepository: function(repoDir, callback) {
     // Create directory
    fs.mkdir(repoDir, 0777, function() {
      execAndAssertError('git --git-dir=' + repoDir + '/.git init', callback);
    });
  },

  copyHookIntoRepo: function(hookName, repoDir, callback) {
    var hooksDestPath = repoDir + '/.git/hooks';

    copyFile(hooksSrcPath + '/' + hookName, hooksDestPath, function() {
      fs.chmod(hooksDestPath + '/' + hookName, 0777, callback);
    });
  },

  commitAllInRepo: function(repoDir, callback) {
    var repoPathArgs = '--git-dir=' + repoDir + '/.git --work-tree=' + repoDir;

    execAndAssertError('git ' + repoPathArgs + ' add .', function() {
      exec("git " + repoPathArgs + " commit -m \"test Commit\"", function(err) {
        callback(err);
      });
    });
  }
};

// Mercurial specific utilities
var HgHelpers = {
  createTmpRepository: function(repoDir, callback) {
    // Create directory
    fs.mkdir(repoDir, 0777, function() {
      execAndAssertError('hg init ' + repoDir, callback);
    });
  },

  copyHookIntoRepo: function(hookName, repoDir, type, callback) {
    var hooksDestPath = repoDir,// + '/.hg',
        hgrc =
          "[hooks]\r\n" +
          "" + type + " = " + hookName + "\r\n";

    copyFile(hooksSrcPath + '/' + hookName, hooksDestPath, function() {
      copyFile('./test/fixtures/hgrc', repoDir + '/.hg', function() {
        // set up hook executing
        fs.chmod(hooksDestPath + '/' + hookName, 0777, callback);
      });
      /*fs.writeFile(repoDir + '/.hg/hgrc', hgrc, function(err) {
        assert.ifError(err);
       // set up hook executing
        fs.chmod(hooksDestPath + '/' + hookName, 0777, callback);
      });*/
    });
  },

  commitAllInRepo: function(repoDir, callback) {
    var args = "--cwd=" + repoDir + " --addremove -m \"test Commit\"";

    exec("hg commit " + args + " .", function(err) {
      callback(err);
    });
  }
};

module.exports = {
  git: GitHelpers,
  hg: HgHelpers,
  generateRandomDirName: generateRandomDirName,
  destroyTmpRepository: destroyTmpRepository,
  copyFixtureIntoRepo: copyFixtureIntoRepo,
  getErrorMessage: getErrorMessage
};