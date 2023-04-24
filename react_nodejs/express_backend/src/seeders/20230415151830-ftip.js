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
    for (let i = 0; i < 8; i++) {
      dummyJSON.push({
        value: `${faker.internet.ip()}`,
        owners: '[1,2,47,9]',
      });
    }
    await queryInterface.bulkInsert('FTIPs', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('FTIPs', null, {});
  }
};

