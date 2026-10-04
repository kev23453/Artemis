'use strict';

const idUserGenerator = require("../../../../Shared/Utils/User_id_generator");
const passwordHasher = require("../../../../Infrastructure/Security/BcryptPasswordHasher");
const config = require("../../../../Infrastructure/Config/config");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(`SELECT id FROM roles WHERE LOWER(name) = 'admin' LIMIT 1`);
    if(roles.length === 0) {
      console.log("There's no exists admin role, cannot create administrator user");
      return;
    }

    const roleId = roles[0].id;
    const hasher = new passwordHasher();
    const passwordHashed = await hasher.hash(config.adminDefault.password);

    const admin = {
      id: idUserGenerator(),
      firstName: "Admin",
      lastName: "Admin",
      username: "Administrator",
      normalizedUsername: "ADMINISTRATOR",
      email: config.adminDefault.email,
      identityNumber: "00000000000",
      emailConfirmed: true,
      password: passwordHashed,
      numberPhone: "0000-0000-0000",
      roleId: roleId
    }

    await queryInterface.bulkInsert('user', [admin]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", {username: "Administrator"})
  }
};
