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
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        created_by: Math.random() * 25,
        expenses: Math.random() * 1000,
        updated_by: 3,
        budget: 45,
        profile_url: faker.internet.avatar(),
        head_1: Math.random() * 10,
        head_2: Math.random() * 10,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('Households', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Households', null, {});
  }
};

