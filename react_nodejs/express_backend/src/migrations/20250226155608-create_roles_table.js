'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('roles', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    permissions: {
      allowNull: true,
      type: Sequelize.JSON // permissionId[]
    }
   })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
