'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('families', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      profile_url: {
        type: Sequelize.STRING
      },
      head_count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      base_location: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      head_1: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      head_2: {
        type: Sequelize.INTEGER
      },
      tree: {
        type: Sequelize.INTEGER
      },
      members: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      created_by: {
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('families');
  }
};