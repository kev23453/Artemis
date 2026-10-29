const RefreshToken = require("../../../Domain/Users/Entities/RefreshToken");
const UnauthorizedError = require("../../Shared/Errors/UnauthorizedError");

class LoginUserUseCase {
    constructor({ userRepository, passwordHasher, accessTokenService, refreshTokenService, refreshTokenRepository }) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async execute( { username, password } ) {
        if(!username && !password) {
            throw new UnauthorizedError("Invalid credentials");
        }
        const user = await this.userRepository.findByUsername(username);
        
        const validUser = await this.passwordHasher.compare(password, user.password);
        if(!validUser) {
            throw new UnauthorizedError("Invalid credentials");
        }

        if(user.emailConfirmed) {
            throw new UnauthorizedError("You must be to active your account, check your email adress");
        }

        const accessToken = this.accessTokenService.sign({
            sub: user.id,
            role: user.role?.name
        })

        const refreshToken = this.refreshTokenService.generate();
        await this.refreshTokenRepository.create(new RefreshToken({
            userId: user.id,
            tokenHash: this.refreshTokenService.hash(refreshToken),
            familyId: this.refreshTokenService.generateFamilyId(),
            expiresAt: this.refreshTokenService.getExpirationDate(),
        }));

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role?.name,
            }
        }
    }
}
module.exports = LoginUserUseCase;