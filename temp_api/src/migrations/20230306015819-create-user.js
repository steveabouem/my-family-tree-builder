'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
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
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1 // 1 active | 0 inactive
      },
      marital_status: {
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      dob: {
        type: Sequelize.STRING,
      },
      role_id: {type: Sequelize.INTEGER},
      email: {
        allowNull: false,
        type: Sequelize.CHAR(255), // https://www.mindbaz.com/en/email-deliverability/what-is-the-maximum-size-of-an-mail-address/
      },
      occupation: {
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      has_ipa: {
        type: Sequelize.INTEGER
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};