'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("loan", {
      id: { type: Sequelize.STRING, primaryKey: true },
      identifierNumber: { type: Sequelize.STRING, unique: true, allowNull: false },
      loanAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      termMonths: { type: Sequelize.FLOAT, allowNull: false } ,
      interestRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      outstandingAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false } ,
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true } ,
      paymentStatus: { type: Sequelize.ENUM('al Dia', 'Retrasado') } ,
      userId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } } ,
      adminId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } },
      monthlyPayment: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("loan");
  }
};
