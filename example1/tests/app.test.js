var sum = require('../app/index').sum;
var should = require('chai').should();

describe('Sum test', function () {
  it('should return 12 when adding 5 and 7', function () {
    var result = sum(5, 7);
    result.should.equal(12);
  })
});