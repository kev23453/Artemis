const crypto = require("crypto");

const generateUserId = () => crypto.randomBytes(8).toString('hex').match(/.{1,4}/g).join('-');

module.exports = generateUserId;