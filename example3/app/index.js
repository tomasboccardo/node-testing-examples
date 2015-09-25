var request = require('request');

module.exports.getFromURL = function (url, callback) {
  request(url, callback)
};
