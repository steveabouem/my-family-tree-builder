'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('Roles', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   code: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   assigned: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
    //   },
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('Roles');
  }
};