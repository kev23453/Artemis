class LogoutUseCase {
    constructor({ refreshTokenService, refreshTokenRepository }) {
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async execute( { refreshToken } ) {
        if(!refreshToken) return;

        const stored = await this.refreshTokenRepository.findByTokenHash(
            this.refreshTokenService.hash(refreshToken)
        )

        if(stored) {
            await this.refreshTokenRepository.revokeFamily(stored.familyId);
        }
    }
}

module.exports = LogoutUseCase;