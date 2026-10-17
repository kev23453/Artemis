//1. importaciones

    // credenciales de configuracion
    const config = require("./Infrastructure/Config/config");

    // configuraciones y modelos
    const configDB = require("./Infrastructure/Persistence/MySQL/Config/db.config");
    const modelsConfig = require("./Infrastructure/Persistence/MySQL/Models/index");

    // entidades de dominio
    const RefreshToken = require("./Domain/Users/Entities/RefreshToken");

    // repositorios
    const InMemoryUserRepository = require("./Infrastructure/Persistence/In-Memory/inMemoryUserRepository");
    const MysqlUserRepository = require("./Infrastructure/Persistence/MySQL/Repositories/MysqlUserRepository");
    const RefreshTokenRepository = require("./Infrastructure/Persistence/MySQL/Repositories/RefreshTokenRepository");

    // casos de uso
    const CreateUserUseCase = require("./Application/Users/Use-cases/CreateUserUseCase");

    // servicios
    const AccessTokenService = require("./Infrastructure/Security/AccessTokenService");
    const RefreshTokenService = require("./Infrastructure/Security/RefreshTokenService");

    // controladores
    const UserController = require("./Presentatiton/http/Controllers/User.controller");

    // agregados de infraestructura
    const PasswordHasher = require("./Infrastructure/Security/BcryptPasswordHasher");
    const EmailService = require("./Infrastructure/Email/EmailService");


//2. construccion de objetos para servicios

const credentialsEmail = {
    host: config.email.host,
    port: config.email.port,
    user: config.email.user,
    password: config.email.password,
    from: config.email.from
}


//3. instancias e inyecciones

    // agregados de infraestructura
    const passwordHasher = new PasswordHasher();
    const emailService = new EmailService(credentialsEmail);

    // repositorios
    /* const inMemoryUserRepository = new InMemoryUserRepository(); */
    const mysqlUserRepository = new MysqlUserRepository(configDB, modelsConfig.userModel);
    const refreshTokenRepository = new RefreshTokenRepository({
        RefreshTokenModel: modelsConfig.refreshTokenModel,   // <- CAMBIO: objeto con el modelo ya creado
    });

    // casos de uso
    const createUserUseCase = new CreateUserUseCase(mysqlUserRepository, passwordHasher);

    // servicios
    const accessTokenService = new AccessTokenService({
        secret: config.auth.jwt.secret,
        expiresIn: config.auth.jwt.expiresIn,
    });
    const refreshTokenService = new RefreshTokenService({
        ttlMs: config.auth.refreshToken.ttlMs,
    });

    // controladores
    const userController = new UserController(createUserUseCase);



//4. exportaciones

module.exports = {
    userController,
    accessTokenService,
    refreshTokenService,
    refreshTokenRepository,
}
