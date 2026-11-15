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
    const BeneficiaryRepository = require("./Infrastructure/Persistence/MySQL/Repositories/BeneficiaryRepository");
    const SavingAccountRepository = require("./Infrastructure/Persistence/MySQL/Repositories/SavingAccountRepository");
    const CardRepository = require("./Infrastructure/Persistence/MySQL/Repositories/CardRepository");

    // casos de uso
    const CreateUserUseCase = require("./Application/Users/Use-cases/CreateUserUseCase");
    const LoginUserUseCase = require("./Application/Auth/Use-cases/LoginUserUseCase");
    const RefreshSessionUseCase = require("./Application/Auth/Use-cases/RefreshSessionUseCase");
    const LogoutUseCase = require("./Application/Auth/Use-cases/LogoutUseCase");
    const CreateBeneficiaryUseCase = require("./Application/Beneficiary/Use-cases/CreateBeneficiaryUseCase");
    const CreateSavingAccountUseCase = require("./Application/Savings_account/Use-cases/CreateSavingsAccountUseCase");
    const CreateCardUseCase = require("./Application/Cards/Use-cases/CreateCardUseCase")

    // servicios
    const AccessTokenService = require("./Infrastructure/Security/AccessTokenService");
    const RefreshTokenService = require("./Infrastructure/Security/RefreshTokenService");

    // controladores
    const UserController = require("./Presentatiton/http/Controllers/User.controller");
    const AuthController = require("./Presentatiton/http/Controllers/Auth.controller");
    const BeneficiaryController = require("./Presentatiton/http/Controllers/BeneficiaryController");
    const SavingAccountController = require("./Presentatiton/http/Controllers/SavingAccount.controller");
    const CardController = require("./Presentatiton/http/Controllers/Card.controller");

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
    const beneficiaryRepository = new BeneficiaryRepository(configDB, modelsConfig.BeneficiariesModel);
    const savingAccountRepository = new SavingAccountRepository(configDB, modelsConfig.SavingsAccount);
    const cardRepository = new CardRepository(configDB, modelsConfig.CardModel);

    // servicios
    const accessTokenService = new AccessTokenService({
        secret: config.auth.jwt.secret,
        expiresIn: config.auth.jwt.expiresIn,
    });
    const refreshTokenService = new RefreshTokenService({
        ttlMs: config.auth.refreshToken.ttlMs,
    });

    // casos de uso
    const createUserUseCase = new CreateUserUseCase(mysqlUserRepository, passwordHasher);

    const loginUserUseCase = new LoginUserUseCase({
        userRepository: mysqlUserRepository,
        passwordHasher,
        accessTokenService,
        refreshTokenService,
        refreshTokenRepository
    })

    const refreshSessionUseCase = new RefreshSessionUseCase({
        userRepository: mysqlUserRepository,
        accessTokenService,
        refreshTokenService,
        refreshTokenRepository
    })

    const logoutUseCase = new LogoutUseCase( { refreshTokenService, refreshTokenRepository } );

    const createBeneficiaryUseCase = new CreateBeneficiaryUseCase(beneficiaryRepository);

    const createSavingAccountUseCase = new CreateSavingAccountUseCase(savingAccountRepository);

    const createCardUseCase = new CreateCardUseCase(cardRepository);


    // controladores
    const userController = new UserController(createUserUseCase);

    const authController = new AuthController({
        loginUserUseCase,
        refreshSessionUseCase,
        logoutUseCase
    });

    const beneficiaryController = new BeneficiaryController(createBeneficiaryUseCase);
    
    const savingAccountController = new SavingAccountController(
        createSavingAccountUseCase
    );

    const cardController = new CardController(createCardUseCase);


//4. exportaciones

module.exports = {
    userController,
    accessTokenService,
    loginUserUseCase,
    refreshSessionUseCase,
    logoutUseCase,
    authController,
    beneficiaryController,
    savingAccountController,
    cardController
    /* refreshTokenService,
    refreshTokenRepository, */
}
