class IAccessTokenService {
    async sign(payload) {
        throw new Error("Method not implemented")
    }

    async verify(token) {
        throw new Error("Method not implemented");
    }
}

module.exports = IAccessTokenService;