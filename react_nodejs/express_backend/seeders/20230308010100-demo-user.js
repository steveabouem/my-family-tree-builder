'use strict';
/** @type {import('sequelize-cli').Migration} */
var { faker } = require('@faker-js/faker');
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    let dummyJSON = [];
    for (let i = 0; i < 5000; i++) {
      dummyJSON.push({
        tasks: '["1", "2", "3", "4", "5"]',
        roles: '["1", "2", "3", "4", "5"]',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        email: faker.internet.email(),
        password: '12345',
      });
    }
    await queryInterface.bulkInsert('Users', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {});
  }
};

