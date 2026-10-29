const { ne } = require("zod/v4/locales");
const UnauthorizedError = require("../../../Application/Shared/Errors/UnauthorizedError");

module.exports = (accessTokenService) => (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || "").split(" ");

    if(scheme !== "Bearer" || !token) {
        return next(new UnauthorizedError("Token is required"))
    }

    try {
        const payload = accessTokenService.verify(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch {
        next(new UnauthorizedError("Token is expired or invalid"))
    }
}