const crypto = require("crypto");

class RefreshTokenService {
    constructor({ttlMs}) {
        this.ttlMs = ttlMs;
    }

    generate(){ 
        return crypto.randomBytes(48).toString('base64url');
    }

    hash(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    generateFamilyId() {
        return crypto.randomUUID();
    }

    getExpirationDate(now = Date.now()) {
        return new Date(now + this.ttlMs);
    }
}

module.exports = RefreshTokenService;