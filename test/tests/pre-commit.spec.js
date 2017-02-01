var expect = require('chai').expect;
var h = require('../helpers');

describe('Pre commit hook', function () {
  function noopModificator(fixture) {
    // no modifications needed
  }

  function addDebuggerModificator(fixture) {
    return fixture.replace('//PLACEHOLDER', 'debugger');
  }

  function addCommentedDebuggerModificator(fixture) {
    return fixture.replace('//PLACEHOLDER', '//debugger');
  }

  function addFdescribeModificator(fixture) {
    return fixture.replace("describe('#constructor'", "fdescribe('#constructor'");
  }

  function addFitModificator(fixture) {
    return fixture.replace("it('should create ID", "fit('should create ID");
  }

  describe('Git', function() {
    var gitRepoDir;

    beforeEach(function (done) {
      gitRepoDir = h.generateRandomDirName('git');

      h.git.createTmpRepository(gitRepoDir, function() {
        h.git.copyHookIntoRepo('pre-commit', gitRepoDir, function() {
          done();
        })
      });
    });

    it('should reject commit file containing fdescribe', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', addFdescribeModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fdescribe'));
          done();
        })
      });
    });

    it('should not reject commit when there is no fdescribe', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', noopModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing fit', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fit'));
          done();
        })
      });
    });

    it('should not reject commit when fit is commented out', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', noopModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing debugger', function (done) {
      h.copyFixtureIntoRepo('fixture1.js', addDebuggerModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('debugger'));
          done();
        })
      });
    });

    it('should not reject commit when debugger is commented out', function (done) {
      h.copyFixtureIntoRepo('fixture1.js', addCommentedDebuggerModificator, gitRepoDir, function() {
        h.git.commitAllInRepo(gitRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    afterEach(function (done) {
      h.destroyTmpRepository(gitRepoDir, function() {
        done();
      });
    });
  });

  describe('Mercural', function () {
    var hgRepoDir;

    beforeEach(function (done) {
      hgRepoDir = h.generateRandomDirName('hg');

      h.hg.createTmpRepository(hgRepoDir, function() {
        h.hg.copyHookIntoRepo('pre-commit', hgRepoDir, 'precommit', function() {
          done();
        })
      });
    });

    it('should reject commit file containing fdescribe', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', addFdescribeModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fdescribe'));
          done();
        })
      });
    });

     it('should not reject commit when there is no fdescribe', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', noopModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing fit', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', addFitModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fit'));
          done();
        })
      });
    });

    it('should not reject commit when fit is commented out', function (done) {
      h.copyFixtureIntoRepo('fixture2.js', noopModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing debugger', function (done) {
      h.copyFixtureIntoRepo('fixture1.js', addDebuggerModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('debugger'));
          done();
        })
      });
    });

    it('should not reject commit when debugger is commented out', function (done) {
      h.copyFixtureIntoRepo('fixture1.js', addCommentedDebuggerModificator, hgRepoDir, function() {
        h.hg.commitAllInRepo(hgRepoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    afterEach(function (done) {
      h.destroyTmpRepository(hgRepoDir, function() {
        done();
      });
    });
  });
});