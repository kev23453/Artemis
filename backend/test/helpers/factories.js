const AccountNumber = require("../../src/Domain/Beneficiary/value-objects/AccountNumber");
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

const BuildBeneficiaryEntity = (overrides = {}) => new Beneficiary(BuildBeneficiaryData(overrides));

const BuildCreateBeneficiaryData = (overrides = {}) => ({
    firstName: "Edgar",
    lastName: "Santana",
    accountNumber: "009444816",
    userId: "d68c-5f65-2320-a83b",
    ...overrides
});

module.exports = {
    BuildBeneficiaryData,
    BuildBeneficiaryEntity,
    BuildCreateBeneficiaryData
};
