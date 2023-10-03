'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FTTrees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      authorized_ips: {
        type: Sequelize.JSON
      },
      public: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: true
      },
      families: {
        type: Sequelize.JSON,
        defaultValue: '[]'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // deal with foreign key constraints
    await queryInterface.dropTable('FTUsers');
    await queryInterface.dropTable('FTFams');
    await queryInterface.dropTable('FTTrees');
  }
};