'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("loan", {
      id: { type: Sequelize.STRING, primaryKey: true },
      identifierNumber: { type: Sequelize.STRING, unique: true, allowNull: false },
      loanAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      termMonths: { type: Sequelize.FLOAT, allowNull: false } ,
      interesRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      OutstandingAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true } ,
      PaymentStatus: { type: Sequelize.ENUM('al Dia', 'Retrasado') } ,
      userId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } } ,
      adminId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } },
      MonthlyPayment: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("loan");
  }
};
