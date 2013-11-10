var UUID = require('node-uuid');
var crypto = require('crypto');

module.exports = function() {
  return crypto.createHash('sha256').update(UUID()).digest('hex');
};
