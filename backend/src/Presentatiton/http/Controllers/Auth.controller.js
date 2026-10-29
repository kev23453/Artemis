const config = require("../../../Infrastructure/Config/config");

const REFRESH_COOKIE = "refresh_token";

const cookieOptions = {
    httpOnly: true,
    secure: config.environment === "production",
    sameSite: "strict",
    path: `/api/${config.api_version}/auth`,
    maxAge: config.auth.refreshToken.ttlMs,
};

const isMobile = (req) => req.headers["x-client-type"] === "mobile";

class AuthController {
    constructor({ loginUserUseCase, refreshSessionUseCase, logoutUseCase }) {
        this.loginUserUseCase = loginUserUseCase;
        this.refreshSessionUseCase = refreshSessionUseCase;
        this.logoutUseCase = logoutUseCase;
    }

    login = async (req, res, next) => {
        try {
            const { accessToken, refreshToken, user } = await this.loginUserUseCase.execute({
                username: req.body.username,
                password: req.body.password,
            });

            if (isMobile(req)) {
                return res.json({ accessToken, refreshToken, user });
            }
            res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
            return res.json({ accessToken, user });
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req, res, next) => {
        try {
            const incoming = isMobile(req) ? req.body.refreshToken : req.cookies[REFRESH_COOKIE];

            const { accessToken, refreshToken } = await this.refreshSessionUseCase.execute({
                refreshToken: incoming,
            });

            if (isMobile(req)) {
                return res.json({ accessToken, refreshToken });
            }
            res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
            return res.json({ accessToken });
        } catch (error) {
            // si la sesión es inválida, se limpia la cookie en la web
            if (!isMobile(req)) {
                res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: undefined });
            }
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            const incoming = isMobile(req) ? req.body.refreshToken : req.cookies[REFRESH_COOKIE];

            await this.logoutUseCase.execute({ refreshToken: incoming });

            if (!isMobile(req)) {
                res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: undefined });
            }
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}


module.exports = AuthController;