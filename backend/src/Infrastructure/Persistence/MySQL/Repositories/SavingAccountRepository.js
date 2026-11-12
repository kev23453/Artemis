const ISavingAccountRepository = require("../../../../Domain/Savings_account/Repositories/SavingsAccountRepository");
/* const { SavingsAccount } = require("../Models") // para pruebas
 */
class SavingAccountRepository extends ISavingAccountRepository {
    constructor(mysqlClient, savingAccountModel) {
        super();
        this.savingAccountModel = savingAccountModel;
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

        return await this.savingAccountModel.create(data, data.id);
    }

    async findById(id) {
        return await this.savingAccountModel.findByPk(id);
    }

    async findByUserId(userId) {
        return await this.savingAccountModel.findAll({where: { userId } })
    }

    async findByAccountNumber(accountNumber) {
        return await this.savingAccountModel.findAll({where: { accountNumber } })

    }

}

module.exports = SavingAccountRepository;