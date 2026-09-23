'use strict';

const { randomUUID } = require("crypto")

const ROLES = [
      {
        id: randomUUID(),
        name: "admin",
        normalizedName: "ADMIN"
      },
      {
        id: randomUUID(),
        name: "cashier",
        normalizedName: "CASHIER"
      },
      {
        id: randomUUID(),
        name: "client",
        normalizedName: "CLIENT"
      }
    ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert("roles", ROLES);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("roles", {
      name: ROLES.map((rol) => rol.name)
    })
  }
};
