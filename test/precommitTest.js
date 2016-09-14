var expect = require('chai').expect;
var h = require('./helpers');

describe('Pre commit hook', function () {
  function noopModificator (fixture) {
    // no modifications needde
  }

  beforeEach(function (done) {
    var repoDir = h.generateRandomDirName();
    this.repoDir = repoDir
    h.createTmpRepository(repoDir, function() {
      h.copyHookIntoRepo('pre-commit', repoDir, function() {
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
      h.commitAllInRepo(repoDir, function(commitError) {
        expect(commitError).to.be.instanceof(Error)
          .and.have.property('message').that.contain(h.getErrorMessage('fdescribe'));
        done();
      })
    });
  });

  it('should not reject commit when there is no fdescribe', function (done) {
    var repoDir = this.repoDir;

    h.copyFixtureIntoRepo('fixture2.js', noopModificator, repoDir, function() {
      h.commitAllInRepo(repoDir, function(commitError) {
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
      h.commitAllInRepo(repoDir, function(commitError) {
        expect(commitError).to.be.instanceof(Error)
          .and.have.property('message').that.contain(h.getErrorMessage('fit'));
        done();
      })
    });
  });

  it('should not reject commit when fit is commented out', function (done) {
    var repoDir = this.repoDir;

    h.copyFixtureIntoRepo('fixture2.js', noopModificator, repoDir, function() {
      h.commitAllInRepo(repoDir, function(commitError) {
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
      h.commitAllInRepo(repoDir, function(commitError) {
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
      h.commitAllInRepo(repoDir, function(commitError) {
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