const RefreshToken = require("../../../Domain/Users/Entities/RefreshToken");
const UnauthorizedError = require("../../Shared/Errors/UnauthorizedError");

class RefreshSessionUseCase {
    constructor({ userRepository, accessTokenService, refreshTokenService, refreshTokenRepository }) {
        this.userRepository = userRepository;
        this.accessTokenService = accessTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenService = refreshTokenService;
    }

    async execute( { refreshToken } ) {
        if(!refreshToken) {
            throw new UnauthorizedError("Refresh token is required");
        }

        const oldHash = this.refreshTokenService.hash(refreshToken);
        const stored = await this.refreshTokenRepository.findByTokenHash(oldHash);

        if(!stored) {
            throw new UnauthorizedError("Session is invalid");
        }

        if(stored.isRevoked()) {
            await this.refreshTokenRepository.revokeFamily(stored.familyId);
            throw new UnauthorizedError("Invalid session");
        }

        if(stored.isExpired()) {
            throw new UnauthorizedError("Expired session");
        }

        const user = await this.userRepository.findById(stored.userId);

        if(!user) {
            await this.refreshTokenRepository.revokeFamily(stored.familyId);
            throw new UnauthorizedError("Invalid session");
        }

        const newRefreshToken = this.refreshTokenService.generate();
        const newHash = this.refreshTokenService.hash(newRefreshToken);

        await this.refreshTokenRepository.revoke(stored.id, { replacedByHash: newHash } );
        await this.refreshTokenRepository.create(new RefreshToken({
            userId: user.id,
            tokenHash: newHash,
            familyId: stored.familyId,
            expiresAt: this.refreshTokenService.getExpirationDate()
        }));

        const accessToken = this.accessTokenService.sign({
            sub: user.id,
            role: user.role?.name
        })

        return { accessToken, refreshToken: newRefreshToken }

    }
}

module.exports = RefreshSessionUseCase;