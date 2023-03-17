'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FTpers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      age: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      occupation: {
        allowNull: false,
        type: Sequelize.STRING
      },
      partner: { type: Sequelize.INTEGER },
      marital_status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_co_head: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      gender: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      profile_url: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      links_to: { type: Sequelize.INTEGER },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FTpers');
  }
};