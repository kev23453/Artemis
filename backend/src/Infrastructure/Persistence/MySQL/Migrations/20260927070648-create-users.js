'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("user", {
      id: { type: Sequelize.STRING, primaryKey: true },
      firstName: { type: Sequelize.STRING(60), allowNull: false },
      lastName: { type: Sequelize.STRING(80), allowNull: false },
      username: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      normalizedUsername: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      identityNumber: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      emailConfirmed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      password: { type: Sequelize.STRING(200), allowNull: false },
      numberPhone: { type: Sequelize.STRING(20) },
      roleId: { 
        type: Sequelize.STRING,
        references: {
          model: "roles",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("user");
  }
};
