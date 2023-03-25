'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn(
      'FTPer', // table name
      'is_co_head');

    await queryInterface.addColumn('FTPer', 'is_parent', { type: DataTypes.BOOLEAN });
    await queryInterface.addColumn('FTPer', 'has_ipa', { type: DataTypes.BOOLEAN });
    await queryInterface.addColumn('FTPer', 'assigned_ip', { type: DataTypes.STRING });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */



  }
};
