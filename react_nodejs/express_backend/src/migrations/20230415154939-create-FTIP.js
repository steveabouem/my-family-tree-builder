'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FTIPs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING
      },
      owners: {
        type: Sequelize.JSON
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FTIPs');
  }
};