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
    for (let i = 0; i < 5000; i++) {
      dummyJSON.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: Math.floor(Math.random() * 80),
        occupation: faker.name.jobArea(),
        partner: Math.floor(Math.random() * 100),
        marital_status: faker.lorem.word(),
        is_parent: dummyBoolean[Math.floor(Math.random() * 3)],
        description: faker.lorem.sentence(),
        gender: dummyGender[Math.floor(Math.random() * 2)],
        profile_url: '',
        assigned_ip: ['123'],
        has_ipa: dummyBoolean[Math.floor(Math.random() * 3)],
        links_to: Math.floor(Math.random() * 90),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('FTUsers', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('FTUsers', null, {});
  }
};