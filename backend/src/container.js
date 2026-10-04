//1. importaciones

    // credenciales de configuracion
    const config = require("./Infrastructure/Config/config");

    // configuraciones
    const configDB = require("./Infrastructure/Persistence/MySQL/Config/db.config");
    const modelsConfig = require("./Infrastructure/Persistence/MySQL/Models/index");

    // repositorios
    const InMemoryUserRepository = require("./Infrastructure/Persistence/In-Memory/inMemoryUserRepository");
    const MysqlUserRepository = require("./Infrastructure/Persistence/MySQL/Repositories/MysqlUserRepository");

    // casos de uso
    const CreateUserUseCase = require("./Application/Users/Use-cases/CreateUserUseCase");

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
   /*  const inMemoryUserRepository = new InMemoryUserRepository(); */
    const mysqlUserRepository = new MysqlUserRepository(configDB, modelsConfig.userModel);

    // casos de uso
    const createUserUseCase = new CreateUserUseCase(mysqlUserRepository, passwordHasher);

    // controladores
    const userController = new UserController(createUserUseCase);



//4. exportaciones

module.exports = {
    userController
}