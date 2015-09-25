var request = require('request');

module.exports.getFromULR = function (url, callback) {
  request(url, callback)
};
