var assert = require('assert');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var hooksSrcPath = '.';

var execAndAssertError = function (command, successCallback) {
  exec(command, function(err) {
    assert.ifError(err);
    successCallback();
  });
}

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

module.exports = {
  generateRandomDirName: function() {
    var dir = 'git_test' + new Date().getTime().toString() + Math.round((Math.random(100000) * 300)).toString();

    return './test/' + dir;
  },

  createTmpRepository: function(repoDir, callback) {
     // Create directory
    fs.mkdir(repoDir, 0777, function() {
      execAndAssertError('git --git-dir=' + repoDir + '/.git init', callback);
    });
  },

  destroyTmpRepository: function(repoDir, callback) {
    execAndAssertError('rm -rf ' + repoDir, callback);
  },

  copyHookIntoRepo: function(hookName, repoDir, callback) {
    var hooksDestPath = repoDir + '/.git/hooks';

    copyFile(hooksSrcPath + '/' + hookName, hooksDestPath, function() {
      fs.chmod(hooksDestPath + '/' + hookName, 0777, callback);
    });
  },

  copyFixtureIntoRepo: function(fixtureName, modificator, repoDir, callback) {
    copyFile('./test/fixtures/' + fixtureName, repoDir, callback, modificator);
  },

  commitAllInRepo: function(repoDir, callback) {
    var repoPathArgs = '--git-dir=' + repoDir + '/.git --work-tree=' + repoDir;

    execAndAssertError('git ' + repoPathArgs + ' add .', function() {
      exec("git " + repoPathArgs + " commit -m 'test Commit'", function(err) {
        callback(err);
      });
    });
  },

  getErrorMessage: function(forbiddenStatement) {
    return 'You forgot to remove a ' + forbiddenStatement + ' in the following files';
  }
}