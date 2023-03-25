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
        public: dummyBoolean[Math.floor(Math.random() * 3)],
        authorized_ips: '["70.81.130.188"]',
        name: faker.name.firstName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('FTTrees', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('FTTrees', null, {});
  }
};

