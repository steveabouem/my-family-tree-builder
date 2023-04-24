'use strict';

/** @type {import('sequelize-cli').Migration} */
var { faker } = require('@faker-js/faker');
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let dummyJSON = [];
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        name: faker.name.lastName(),
        description: faker.lorem.sentence(),
        created_by: Math.round(Math.random() * 25),
        updated_by: Math.round(Math.random() * 25),
        expenses: Math.random() * 1000,
        budget: Math.random() * 1000,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('Objectives', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Objectives', null, {});
  }
};
