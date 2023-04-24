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
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        name: faker.name.lastName(),
        coords: '',
        flag_url: '',
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
      });
    }
    // await queryInterface.bulkInsert('FTLocs', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    // await queryInterface.bulkDelete('FTLocs', null, {});
  }
};