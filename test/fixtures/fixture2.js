describe('Countdowner', function () {
  var Countdowner, element;

  var createPlaceholderElement = function(id) {
    var pl = document.createElement('div');
    if(id) { pl.id = id; }
    document.body.appendChild(pl);

    return pl;
  }

  before(function () {
    Countdowner = require('../src/countdowner');
  });

  it('should have zero count of countdowners on start', function () {
    expect(Countdowner.index).to.equal(0);
  });

  describe('#constructor', function () {
    beforeEach(function () {
      Countdowner.index = 0;
    });

    it('should throw when date not supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Object())
      }).to.throw('Only Date object is accepted as a constructor parameter');
    });

    it('should not throw when date supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Date())
      }).to.not.throw();
    });

    it('should create ID of related element', function() {
      cd1 = new Countdowner(new Date);
      cd2 = new Countdowner(new Date);
      cd3 = new Countdowner(new Date);

      expect(cd1.ID).to.equal('cd1');
      expect(cd2.ID).to.equal('cd2');
      expect(cd3.ID).to.equal('cd3');
    });
  });
});