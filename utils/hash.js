const {createHash} = require('crypto')

module.exports.hash = (string) => createHash('sha256').update(string).digest('hex');
