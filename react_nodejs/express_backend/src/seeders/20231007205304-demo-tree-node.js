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
    const dummyGender = [1, 2];
    const dummyFams = [];
    for (let i = 0; i < 5; i++) {
      dummyFams.push(Math.floor(Math.random() * 20));
    }
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: Math.floor(Math.random() * 80),
        parent_1: Math.floor(Math.random() * 80),
        parent_2: Math.floor(Math.random() * 80),
        ft_id: Math.floor(Math.random() * 80),
        profile_url: faker.internet.avatar()
      });
    }

    await queryInterface.bulkInsert('FTNodes', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('FTNodes', null, {});
  }
};
