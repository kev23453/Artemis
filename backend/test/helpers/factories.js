const AccountNumber = require("../../src/Domain/Shared/AccountNumber");
const BeneficiaryFullName = require("../../src/Domain/Beneficiary/value-objects/BeneficiaryFullName");
const Beneficiary = require("../../src/Domain/Beneficiary/entities/beneficiary");
const SavingsAccount = require("../../src/Domain/Savings_account/Entities/Savings_account");
const Card = require("../../src/Domain/Cards/Entities/Card");

const BuildBeneficiaryData = (overrides = {}) => ({
    id: "3233-1118-1111-0005",
    fullname: new BeneficiaryFullName("Edgar", "Santana"),
    accountNumber: new AccountNumber("009444816"),
    userId: "d68c-5f65-2320-a83b",
    active: true,
    ...overrides
});

// using for DTOS
const BuildBeneficiaryEntity = (overrides = {}) => new Beneficiary(BuildBeneficiaryData(overrides));

const BuildCreateBeneficiaryData = (overrides = {}) => ({
    firstName: "Edgar",
    lastName: "Santana",
    accountNumber: "009444816",
    userId: "d68c-5f65-2320-a83b",
    ...overrides
});


const buildSavingsAccountData = (overrides = {}) => ({
    id: "4444-0008-8888-0059",
    accountNumber: new AccountNumber("259984125"),
    balance: 6000,
    userId: "8888-1111-0000-8889",
    isPrincipal: true,
    isActive: true,
    adminId: "8898-5555-1118-5555",
    ...overrides
})


const buildSavingsAccountEntity = (overrides = {}) => new SavingsAccount(buildSavingsAccountData(overrides));

// plain object for DTOs
const buildCreateSavingsAccountData = (overrides = {}) => ({
    accountNumber: "259984125",
    balance: 6000,
    userId: "8888-1111-0000-8889",
    isPrincipal: true,
    isActive: true,
    adminId: "8898-5555-1118-5555",
    ...overrides
});


const buildCardData = (overrides = {}) => ({
    id: "5555-1111-2222-0001",
    identifierNumber: 4111111111111111,
    creditLimit: 50000,
    expireDate: "2028-03-31T23:59:59.000Z",
    cvcCode: "123",
    isActive: true,
    userId: "8888-1111-0000-8889",
    adminId: "8898-5555-1118-5555",
    ...overrides
});

const buildCardEntity = (overrides = {}) => new Card(buildCardData(overrides));


module.exports = {
    BuildBeneficiaryData,
    BuildBeneficiaryEntity,
    BuildCreateBeneficiaryData,
    buildSavingsAccountData,
    buildSavingsAccountEntity,
    buildCreateSavingsAccountData,
    buildCardData,
    buildCardEntity
};
