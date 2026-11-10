const ISavingAccountRepository = require("../../../../Domain/Savings_account/Repositories/SavingsAccountRepository");
const { ran } = require("crypto");

class SavingAccountRepository extends ISavingAccountRepository {
    constructor(mysqlClient, savingAccountModel) {
        super();
        this.SavingAccountModel = savingAccountModel;
        this.mysqlClient = mysqlClient;
    }

     async save(SavingsAccount) {
        const data = {
            id: SavingsAccount.id,
            accountNumber: SavingsAccount.accountNumber.value,
            balance: SavingsAccount.balance,
            userId: SavingsAccount.userId,
            isPrincipal: SavingsAccount.isPrincipal,
            isActive: SavingsAccount.isActive,
            createdAt: SavingsAccount.createdAt,
            adminId: SavingsAccount.adminId
        }

        return await this.SavingAccountModel.create(data, data.id);
    }

    async findById(id) {
        throw new Error("Method findById(id) must be implemented");
    }

    async findByUserId(userId) {
         throw new Error("Method findByUserId(userId) must be implemented");
    }

}

module.exports = SavingAccountRepository;