const UserRepository = require("../../../../Domain/Users/Repositories/UserRepository")

class MysqlUserRepository extends UserRepository {
    constructor(MysqlClient, UserModel) {
        super();
        this.MysqlClient = MysqlClient;
        this.UserModel = UserModel;
    }

    async save(user, hashedPassword) {
        
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            normalizedUsername: `${user.username}`.toUpperCase(),
            email: user.email.getValue(),
            password: hashedPassword,
            identityNumber: user.identityNumber,
            numberPhone: user.numberPhone,
            roleId: user.roleId
        }

        const [userRecord, created] = await this.UserModel.findOrCreate({
            where: {
                id: user.id
            },
            defaults: userData
        });

        if (!created) {
            await userRecord.update(userData);
        }
        return userRecord;
    }

    async findByEmail(email) {
        throw new Error("Method not implemented");
    }

    async findById(id) {
        throw new Error("Method not implemented");
    }
}

module.exports = MysqlUserRepository;