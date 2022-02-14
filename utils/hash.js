const { createHash } = require('crypto');

module.exports = (string) => createHash('sha256').update(string).digest('hex');
