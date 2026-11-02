'use strict';

/** 
 * @type {import('sequelize-cli').Migration} 
 * */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("savings_account", {
      id: { type: Sequelize.STRING, primaryKey: true },
      accountNumber: { type: Sequelize.STRING, allowNull: false},
      balance: { type: Sequelize.DECIMAL(18, 2), allowNull: null },
      userId: { type: Sequelize.STRING, references: { model: "user", key: "id" } },
      isPrincipal: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
      adminId: { type: Sequelize.STRING, references: { model: "user", key: "id" } }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("savings_account")
  }
};
