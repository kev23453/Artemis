const IBeneficiaryRepository = require("../../../../Domain/Beneficiary/Repositories/BeneficiaryRepository");

class BeneficiaryRepository extends IBeneficiaryRepository {
    constructor( MysqlClient, BeneficiaryModel ) {
        super();
        this.MysqlClient = MysqlClient;
        this.BeneficiaryModel = BeneficiaryModel;
    }

    async create(Beneficiary) {
        const BeneficiaryData = {
            id: Beneficiary.id,
            firstName: Beneficiary.fullname.firstName,
            lastName: Beneficiary.fullname.lastName,
            accountNumber: Beneficiary.accountNumber.value,
            userId: Beneficiary.userId
        }

        return await this.BeneficiaryModel.create(BeneficiaryData);
    }

    async findById(id) {
        throw new Error("Method not implemented")
    }

    async findByAccountNumber(accountNumber) {
        throw new Error("Method not implemented");
    }
}

module.exports = BeneficiaryRepository;