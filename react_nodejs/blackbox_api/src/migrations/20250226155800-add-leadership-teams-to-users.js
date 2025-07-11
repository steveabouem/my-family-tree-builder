'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'leadership', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
    
    await queryInterface.addColumn('users', 'teams', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'leadership');
    await queryInterface.removeColumn('users', 'teams');
  }
}; 