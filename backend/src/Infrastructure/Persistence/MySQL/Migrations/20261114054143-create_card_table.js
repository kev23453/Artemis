'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("card", {
      id: { type: Sequelize.STRING, primaryKey: true },
      identifierNumber: { type: Sequelize.CHAR(16), allowNull: false, unique: true },
      creditLimit: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      expireDate: { type: Sequelize.STRING, allowNull: false },
      amountDebt: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      cvcCode: { type: Sequelize.STRING, allowNull: false, unique: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      userId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } },
      adminId: { type: Sequelize.STRING, allowNull: false, references: { model: "user", key: "id" } },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("card");
  }
};
