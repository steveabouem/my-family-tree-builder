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
    let dummyBoolean = [true, false, true, false];
    for (let i = 0; i < 5000; i++) {
      dummyJSON.push({
        name: faker.name.lastName(),
        active: dummyBoolean[Math.floor(Math.random() * 3)],
        head_count: 6,
        profile_url: '',
        linked_fams: '[1,10,5,7]', // FTFams
        description: faker.lorem.sentence(),
        base_location: Math.floor(Math.random() * 40), // FTLoc
        head_1: 16, // FTUser
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('FTFams', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('FTFams', null, {});
  }
};

