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
        description: faker.lorem.sentence(),
        created_by: Math.round(Math.random() * 25),
        cost: Math.random() * 1000,
        assignees: '[1, 20, 30]',
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        updated_by: 22
      });
    }
    await queryInterface.bulkInsert('Tasks', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tasks', null, {});
  }
};
