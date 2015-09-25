var getFromURL = require('../app/index').getFromURL;
var should = require('chai').should();
var nock = require('nock');

describe('Request test', function () {
  beforeEach(function() {
    nock('http://fdvsolutions.com')
      .get('/')
      .reply(200, {
        message: 'Hello World!'
      })
  });

  it('should get message Hello World! when getting / from FDV Solutions site', function (done) {
    getFromURL('http://fdvsolutions.com', function (error, response, body) {
      response.should.have.property('statusCode', 200);
      var body_object = JSON.parse(body);
      body_object.should.have.property('message', 'Hello World!');
      done()
    })
  })
});