const { DataTypes } = require("sequelize")
const sequelize = require("../Config/db.config");

const Loan = sequelize.define("loan", {
    id: { type: DataTypes.STRING, primaryKey: true },
    identifierNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    loanAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    termMonths: { type: DataTypes.FLOAT, allowNull: false } ,
    interestRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    outstandingAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true } ,
    paymentStatus: { type: DataTypes.ENUM('al Dia', 'Retrasado') } ,
    userId: { type: DataTypes.STRING, allowNull: false, } ,
    adminId: { type: DataTypes.STRING, allowNull: false, },
    monthlyPayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
}, {
    timestamps: true,
    tableName: "loan"
})

module.exports = Loan;