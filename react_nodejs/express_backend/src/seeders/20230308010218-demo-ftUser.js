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
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: Math.floor(Math.random() * 80),
        email: 'abcd@efg.com',
        occupation: faker.name.jobArea(),
        partner: Math.floor(Math.random() * 100),
        marital_status: faker.lorem.word(),
        password: '12345',
        is_parent: dummyBoolean[Math.floor(Math.random() * 3)],
        has_ipa: dummyBoolean[Math.floor(Math.random() * 3)],
        gender: dummyGender[Math.floor(Math.random() * 2)],
        assigned_ips: '["123", "456"]',
        profile_url: '',
        description: faker.lorem.sentence(),
        imm_family: Math.floor(Math.random() * 90),
        related_to: '[1,4,5,6]',
        // createdAt: faker.date.past(),
        // updatedAt: faker.date.past(),
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