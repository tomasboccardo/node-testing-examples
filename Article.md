# Unit Testing with Node.js

## Introduction

Unit testing is a really important part of software development. It can make the difference between a good piece of software and a mediocre one. In this article we will discuss What? Why? and How? of unit testing with Node.js

## What?

Unit testing is a software development practice that helps the programmer gain confidence by writing and running tests for the functionality he's building. But the main goal of unit testing is not to test the entire piece of software but to isolate smaller components and test them separately to ensure that all the component’s requirements are fulfilled as expected.

## Why?

To begin with, unit testing gives confidence that each component that's being built is working according to the contract specified in the design. This is quite useful when making changes on existing code. Imagine yourself jumping in a new project and having to make changes to existing functionality without tests. There is no way to be sure that what you're changing won't introduce bugs. Unit testing helps a lot in those cases as you can change what's needed and run the tests to be sure that everything is working.

Also, unit testing helps the programmer separate the functionality he's building into small modules with one single responsibility to make them easy to test. There is a development process that suggests writing the tests before writing the functionality. That way, you are forced to design your components first, write tests for them and finally implement those components that make the tests pass. That process is called Test Driven Design(TDD) and is part of a larger methodology called Extreme Programming(XP).

Unit testing serves as documentation for your code as well. They show the way a component is used and what's the interface it exposes. Many programmers that want to use external components on their software just look at the tests to get examples on how the components are used.

## How?

Ok, we know what unit testing is about and why it’s useful. Now let’s discuss how it can be used on Node.js.

First, you will need a test runner. [Mocha](https://mochajs.org/) a good choice for this task as it provides great functionality and allows the programmer to customize the tools he will use to write the tests.

Once we have the test runner we will need an assertion library. There are a lot out there, but I would suggest [Chai](http://chaijs.com/). It provides both BDD and TDD style languages, so you can chose what you prefer.

With these two tools we can start writing simple unit tests. Here is an example of a test for the sum function I've created.

example1/app/index.js

    module.exports.sum = function (a, b) {
      return a + b
    };

example1/tests/app.test.js

    var sum = require('../app/index').sum;
    var should = require('chai').should();

    describe('Sum test', function () {
      it('should return 12 when adding 5 and 7', function () {
        var result = sum(5, 7);
        result.should.equal(12);
      })
    });

As you can see, Mocha allows us to be quite descriptive with our tests names and chai provides a very easy to read interface for assertion.

This is useful, but when working with more complex components we will need a mocking library to be able to isolate our modules. For example, for testing how a callback is being called we can use [Sinon.js](http://sinonjs.org/)

Let me show you a little example on how this is done

example2/app/index.js

    module.exports.sumAndCallback = function (a, b, callback) {
      callback(a + b)
    };

example2/tests/app.test.js

    var sumAndCallback = require('../app/index').sumAndCallback;
    var assert = require('chai').assert;
    var sinon = require('sinon');

    describe('Sum test', function () {
      it('should call the callback once with parameter 12 when adding 5 and 7', function () {
        var callback = sinon.spy();
        sumAndCallback(5, 7, callback);
        assert.isTrue(callback.calledOnce);
        assert.isTrue(callback.calledWith(12));
      })
    });

Also, there are some cases that we will need to consume external services via HTTP requests. [nock](https://github.com/pgte/nock) is a great choice to achieve that. It's really simple to use and provides a way to mock HTTP requests without having to worry about the method being used. Here’s an example on how it’s used

example3/app/index.js

    var request = require('request');

    module.exports.getFromURL = function (url, callback) {
      request(url, callback)
    };

example3/tests/app.test.js

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

The last tool in our unit testing toolbox is [Rewire](https://github.com/jhnns/rewire/), a dependency injector. It's quite useful when you need to mock module dependencies.
Let's look at the example:

example4/app/index.js

    var fs = require('fs');

    module.exports.checkFileExists = function (file, callback) {
      fs.exists(file, callback);
    };

example4/tests/app.test.js

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

      it('should call callback once with parameters null and true', function (done) {
        var callback = sinon.spy();
        app.checkFileExists('path', callback);
        assert.isTrue(callback.calledOnce);
        assert.isTrue(callback.calledWith('No errors :D', 'This is working!'));
        done()
      })
    });

## Conclusion

It's been presented the Node.js Unit Testing Toolbox. You can achieve everything you need using this five tools, but there are plenty of tools that can be use and get the same result. Feel free to research and choose the best for you.

All the code that was displayed in this article was uploaded to [my repo](https://github.com/tomasboccardo/node-testing-examples), so you can take a look and experiment a bit with it.
