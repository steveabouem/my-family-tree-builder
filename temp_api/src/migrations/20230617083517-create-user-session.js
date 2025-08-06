'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      data: {
        type: Sequelize.TEXT 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};