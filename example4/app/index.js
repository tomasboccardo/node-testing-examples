var fs = require('fs');

module.exports.checkFileExists = function (file, callback) {
  fs.exists(file, callback);
};
