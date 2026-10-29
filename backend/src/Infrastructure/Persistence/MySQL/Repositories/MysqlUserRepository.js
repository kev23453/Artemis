const UserRepository = require("../../../../Domain/Users/Repositories/UserRepository")

class MysqlUserRepository extends UserRepository {
    constructor(MysqlClient, UserModel, RoleModel) {
        super();
        this.MysqlClient = MysqlClient;
        this.RoleModel = RoleModel;
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
        return await this.UserModel.findOne({where: { email }});
    }

    async findByUsername(username) {
        return await this.UserModel.findOne({where: { username } });
    }

    async findById(id) {
        return await this.UserModel.findByPk(id, { include: [ { model: this.RoleModel, as: "role" } ] } );
    }
}

module.exports = MysqlUserRepository;