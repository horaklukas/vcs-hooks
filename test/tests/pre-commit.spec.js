var expect = require('chai').expect;
var h = require('../helpers');

describe('Pre commit hook', function() {
  function addDebuggerModificator(fixture) {
    return fixture.replace('//PLACEHOLDER', 'debugger');
  }

  function addCommentedDebuggerModificator(fixture) {
    return fixture.replace('//PLACEHOLDER', '//debugger');
  }

  function addFdescribeModificator(fixture) {
    /* eslint-disable quotes */
    return fixture.replace("describe('#constructor'", "fdescribe('#constructor'");
    /* eslint-enable quotes */
  }

  function addFitModificator(fixture) {
    /* eslint-disable quotes */
    return fixture.replace("it('should create ID", "fit('should create ID");
    /* eslint-enable quotes */
  }

  function assertCommitErrorContainsMessage(commitError, message) {
     expect(commitError).to.be.instanceof(Error).and.have.property('message').that.contain(message);
  }

  describe('Git', function() {
    var gitRepoDir;

    beforeEach(function(done) {
      gitRepoDir = h.generateRandomDirName('git');

      h.git.createTmpRepository(gitRepoDir, function() {
        h.git.copyHookIntoRepo('pre-commit', gitRepoDir, function() {
          done();
        });
      });
    });

    it('should reject commit file containing fdescribe', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', addFdescribeModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('fdescribe'));
          done();
        });
      });
    });

    it('should not reject commit when there is no fdescribe', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', null, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should reject commit file containing fit', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('fit'));
          done();
        });
      });
    });

    it('should not reject commit when fit is commented out', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', null, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should reject commit file containing debugger', function(done) {
      h.copyFixtureIntoRepo('fixture1.js', addDebuggerModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('debugger'));
          done();
        });
      });
    });

    it('should not reject commit when debugger is commented out', function(done) {
      h.copyFixtureIntoRepo('fixture1.js', addCommentedDebuggerModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should print just the one dirty file in error when commiting more files', function(done) {
      var errorMessage = h.getErrorMessage('fit', ['fixture2.js']);

      h.copyFixtureIntoRepo('fixture1.js', null, gitRepoDir, function() {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, gitRepoDir, function() {
      h.copyFixtureIntoRepo('fixture3.json', null, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, errorMessage);
          done();
        });
      });
      });
      });
    });

    it('should reject commit in hirearchy structure', function(done) {
      var errorMessage = h.getErrorMessage('debugger', ['fixture-dir3.js']);

       h.copyDirFixtureIntoRepo('dir1', gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, errorMessage);
          done();
        });
      });
    });

    afterEach(function(done) {
      h.destroyTmpRepository(gitRepoDir, function() {
        done();
      });
    });
  });

  describe('Mercural', function() {
    var hgRepoDir;

    beforeEach(function(done) {
      hgRepoDir = h.generateRandomDirName('hg');

      h.hg.createTmpRepository(hgRepoDir, function() {
        h.hg.copyHookIntoRepo('pre-commit', hgRepoDir, 'precommit', function() {
          done();
        });
      });
    });

    it('should reject commit file containing fdescribe', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', addFdescribeModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('fdescribe'));
          done();
        });
      });
    });

    it('should not reject commit when there is no fdescribe', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', null, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should reject commit file containing fit', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('fit'));
          done();
        });
      });
    });

    it('should not reject commit when fit is commented out', function(done) {
      h.copyFixtureIntoRepo('fixture2.js', null, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should reject commit file containing debugger', function(done) {
      h.copyFixtureIntoRepo('fixture1.js', addDebuggerModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, h.getErrorMessage('debugger'));
          done();
        });
      });
    });

    it('should not reject commit when debugger is commented out', function(done) {
      h.copyFixtureIntoRepo('fixture1.js', addCommentedDebuggerModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    it('should print just the one dirty file in error when commiting more files', function(done) {
      var errorMessage = h.getErrorMessage('fit', ['fixture2.js']);

      h.copyFixtureIntoRepo('fixture1.js', null, hgRepoDir, function() {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, hgRepoDir, function() {
      h.copyFixtureIntoRepo('fixture3.json', null, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          assertCommitErrorContainsMessage(commitError, errorMessage);
          done();
        });
      });
      });
      });
    });

    afterEach(function(done) {
      h.destroyTmpRepository(hgRepoDir, function() {
        done();;
      });
    });
  });
});