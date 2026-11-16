const { DataTypes } = require("sequelize")
const sequelize = require("../Config/db.config");

const Loan = sequelize.define("loan", {
    id: { type: DataTypes.STRING, primaryKey: true },
    identifierNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    loanAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    termMonths: { type: DataTypes.FLOAT, allowNull: false } ,
    interesRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    OutstandingAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true } ,
    PaymentStatus: { type: DataTypes.ENUM('al Dia', 'Retrasado') } ,
    userId: { type: DataTypes.STRING, allowNull: false, } ,
    adminId: { type: DataTypes.STRING, allowNull: false, },
    MonthlyPayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false } ,
})

module.exports = Loan;