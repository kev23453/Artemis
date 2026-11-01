const crypto = require("crypto");

const generateBeneficiaryId = () => crypto.randomBytes(8).toString('hex').match(/.{1,4}/g).join('-');

module.exports = generateBeneficiaryId;
