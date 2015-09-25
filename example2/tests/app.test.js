var sumAndCallback = require('../app/index').sumAndCallback;
var assert = require('chai').assert;
var sinon = require('sinon');

describe('Sum test', function () {
  it('should call the callback once with parameter 12 when adding 5 and 7', function (done) {
    var callback = sinon.spy();
    sumAndCallback(5, 7, callback);
    assert.isTrue(callback.calledOnce);
    assert.isTrue(callback.calledWith(12));
    done()
  })
});