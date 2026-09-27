//1. importaciones

    // repositorios
    const InMemoryUserRepository = require("./Infrastructure/Persistence/In-Memory/inMemoryUserRepository");

    // casos de uso
    const CreateUserUseCase = require("./Application/Users/Use-cases/CreateUserUseCase");

    // controladores
    const UserController = require("./Presentatiton/http/Controllers/User.controller");
    
    // agregados de infraestructura 


//2. instancias e inyecciones

     // repositorios
    const inMemoryUserRepository = new InMemoryUserRepository();

    // casos de uso
    const createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

    // controladores
    const userController = new UserController(createUserUseCase);
    
    // agregados de infraestructura 



//3. exportaciones

module.exports = {
    userController
}