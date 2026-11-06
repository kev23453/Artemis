const AccountNumber = require("../../src/Domain/Shared/AccountNumber");
const BeneficiaryFullName = require("../../src/Domain/Beneficiary/value-objects/BeneficiaryFullName");
const Beneficiary = require("../../src/Domain/Beneficiary/entities/beneficiary");

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




module.exports = {
    BuildBeneficiaryData,
    BuildBeneficiaryEntity,
    BuildCreateBeneficiaryData,
    buildSavingsAccountData
};
