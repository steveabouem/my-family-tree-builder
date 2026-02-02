'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('family_members', 'profile_url', {type: Sequelize.BLOB('long') });
  },

  async down(queryInterface, Sequelize) {
    
  }
};
