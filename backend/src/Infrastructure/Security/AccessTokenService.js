const jwt = require("jsonwebtoken");
const IAccessTokenService = require("../../Application/Shared/Security/IAccessTokenService");

class AccessTokenService extends IAccessTokenService {
    constructor({secret, expiresIn}) {
        super();
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    sign(payload) {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
            algorithm: 'HS256',
        })
    }

    verifyToken(token) {
        return jwt.verify(token, this.secret, {algorithms: ["HS256"]})
    }
}

module.exports = AccessTokenService;