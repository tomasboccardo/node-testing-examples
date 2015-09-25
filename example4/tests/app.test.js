var rewire = require('rewire')
var app = rewire('../app/index');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('File exists test', function () {
  beforeEach(function() {
    app.__set__(
      {
        fs: {
          exists: function (path, callback) {
            callback('No errors :D', 'This is working!')
          }
        }
      }
    )
  });

  it('should call callback onece with parameters null and true', function (done) {
    var callback = sinon.spy();
    app.checkFileExists('path', callback);
    assert.isTrue(callback.calledOnce);
    assert.isTrue(callback.calledWith('No errors :D', 'This is working!'));
    done()
  })
});