'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('beneficiaries', {
      id: { type: Sequelize.STRING, primaryKey: true },
      firstName: { type: Sequelize.STRING(80), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      accountNumber: { type: Sequelize.STRING(9), allowNull: false },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
      updatedAt: { type: Sequelize.DATE },
      userId: { type: Sequelize.STRING, allowNull: false, references: { model: 'user', key: 'id' } }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('beneficiaries');
  }
};
