var fixture = require('./dir2/dir3/fixture-dir3');
var assert = require('assert');

it('should get number', function() {
  assert.true(fixture.getNumber() === 3);
});