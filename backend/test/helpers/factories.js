const BuildBeneficiaryData = (overrides = {}) => ({
    firstName: "Maria",
    lastName: "Fernanda",
    accountNumber: "009444816118",
    userId: "",
    ...overrides
})

module.exports = { BuildBeneficiaryData }; 