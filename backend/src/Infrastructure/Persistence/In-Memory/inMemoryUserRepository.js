const UserRepository = require("../../../Domain/Users/Repositories/UserRepository");

class inMemoryUserRepository extends UserRepository{
    constructor() {
        super();
        this.users = new Map();
    }
    async save(user) {
        this.users.set(user.id, user);
    }
    async findByEmail(email) {
        for(const user of this.users.values()) {
            if(user.email === email) {
                return user;
            }
        }
    }
    async findById(id) {
        return this.users.get(id);
    }
}
module.exports = inMemoryUserRepository; 