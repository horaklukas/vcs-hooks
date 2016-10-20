var expect = require('chai').expect;
var h = require('./helpers');

describe('Pre commit hook', function () {
  function noopModificator (fixture) {
    // no modifications needed
  }

  describe.skip('Git', function() {
    beforeEach(function (done) {
      var repoDir = h.generateRandomDirName('git');
      this.repoDir = repoDir;
      h.git.createTmpRepository(repoDir, function() {
        h.git.copyHookIntoRepo('pre-commit', repoDir, function() {
          done();
        })
      });
    });

    it('should reject commit file containing fdescribe', function (done) {
      var repoDir = this.repoDir,
          modificator;

      modificator = function(fixture) {
        return fixture.replace("describe('#constructor'", "fdescribe('#constructor'");
      };

      h.copyFixtureIntoRepo('fixture2.js', modificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fdescribe'));
          done();
        })
      });
    });

    it('should not reject commit when there is no fdescribe', function (done) {
      var repoDir = this.repoDir;

      h.copyFixtureIntoRepo('fixture2.js', noopModificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing fit', function (done) {
      var repoDir = this.repoDir,
          modificator;

      modificator = function(fixture) {
        return fixture.replace("it('should create ID", "fit('should create ID");
      };

      h.copyFixtureIntoRepo('fixture2.js', modificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fit'));
          done();
        })
      });
    });

    it('should not reject commit when fit is commented out', function (done) {
      var repoDir = this.repoDir;

      h.copyFixtureIntoRepo('fixture2.js', noopModificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        })
      });
    });

    it('should reject commit file containing debugger', function (done) {
      var repoDir = this.repoDir,
          modificator;

      modificator = function(fixture) {
        return fixture.replace('//PLACEHOLDER', 'debugger');
      };

      h.copyFixtureIntoRepo('fixture1.js', modificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('debugger'));
          done();
        })
      });
    });

    it('should not reject commit when debugger is commented out', function (done) {
      var repoDir = this.repoDir,
          modificator;

      modificator = function(fixture) {
        return fixture.replace('//PLACEHOLDER', '//debugger');
      };

      h.copyFixtureIntoRepo('fixture1.js', modificator, repoDir, function() {
        h.git.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.null;
          done();
        });
      });
    });

    afterEach(function (done) {
      h.destroyTmpRepository(this.repoDir, function() {
        done();
      });
    });
  });

  describe('Mercural', function () {
    beforeEach(function (done) {
      var repoDir = h.generateRandomDirName('hg');
      this.repoDir = repoDir;
      h.hg.createTmpRepository(repoDir, function() {
        h.hg.copyHookIntoRepo('pre-commit', repoDir, 'precommit', function() {
          done();
        })
      });
    });

    it.skip('test basic setting', function () {
      expect(true).to.be.true;
    });

    it('should reject commit file containing fdescribe', function (done) {
      var repoDir = this.repoDir,
          modificator;

      modificator = function(fixture) {
        return fixture.replace("describe('#constructor'", "fdescribe('#constructor'");
      };

      h.copyFixtureIntoRepo('fixture2.js', modificator, repoDir, function() {
        h.hg.commitAllInRepo(repoDir, function(commitError) {
          expect(commitError).to.be.instanceof(Error)
              .and.have.property('message').that.contain(h.getErrorMessage('fdescribe'));
          done();
        })
      });
    });


    /*afterEach(function (done) {
      h.destroyTmpRepository(this.repoDir, function() {
        done();
      });
    });*/
  });

});