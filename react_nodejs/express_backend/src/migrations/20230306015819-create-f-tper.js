'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FTUsers', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
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
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_parent: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      has_ipa: {
        type: Sequelize.BOOLEAN
      },
      gender: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assigned_ips: {
        allowNull: false,
        type: Sequelize.JSON
      },
      profile_url: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      imm_family: { type: Sequelize.INTEGER },
      related_to: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FTUsers');
  }
};