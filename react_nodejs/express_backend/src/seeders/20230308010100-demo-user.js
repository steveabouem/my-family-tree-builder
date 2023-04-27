'use strict';
/** @type {import('sequelize-cli').Migration} */
var { faker } = require('@faker-js/faker');
var bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    const salt = bcrypt.genSaltSync(8);
    const admin = {
      tasks: '[1, 2, 3, 4, 5]',
      roles: '[3]',
      active: true,
      first_name: 'Steve',
      last_name: 'Abouem',
      created_at: faker.date.past(),
      updated_at: faker.date.past(),
      email: 'tracker.admin@faker.com',
      password: bcrypt.hashSync('behappyandfocus', salt)
    }

    let dummyJSON = [admin];
    let dummyBoolean = [true, false, true, false];
    for (let i = 0; i < 50; i++) {
      dummyJSON.push({
        tasks: '[1, 2, 3, 4, 5]',
        roles: '[1]',
        active: dummyBoolean[Math.floor(Math.random() * 3)],
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        email: faker.internet.email(),
        updated_by: 3,
        password: '11111111111111',
      });
    }
    await queryInterface.bulkInsert('Users', dummyJSON, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {});
  }
};

