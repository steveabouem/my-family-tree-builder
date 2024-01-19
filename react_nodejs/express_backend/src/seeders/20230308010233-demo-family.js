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
    let dummyMembers = [];
    for (let i = 0; i < 5; i++) {
      dummyMembers.push(Math.floor(Math.random() * 20));
    }
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        name: faker.name.lastName(),
        head_count: 6,
        profile_url: '',
        members: JSON.stringify(dummyMembers),
        description: faker.lorem.sentence(),
        base_location: Math.floor(Math.random() * 40),
        head_1: 16, // User
        head_2: 17, // User
        created_by: 1,
        // created_at: faker.date.past(),
        // updated_at: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('Families', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Families', null, {});
  }
};

