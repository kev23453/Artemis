'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("refreshToken", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        },
      },
      tokenHash: { 
      type: Sequelize.CHAR(64), 
      allowNull: false,
      unique: true
      },
      familyId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE, 
        allowNull: false
      },
      revokedAt: {
        type: Sequelize.DATE, 
        allowNull: true
      },
      replacedByHash: {
        type: Sequelize.CHAR(64), 
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("refreshToken");
  }
};
