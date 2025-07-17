'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('teams', {
    //   id: {
    //     autoIncrement: true,
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     allowNull: false,
    //   },
    //   name: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   members: {
    //     allowNull: false,
    //     type: Sequelize.JSON,
    //     defaultValue: []
    //   },
    //   lead: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
    //   },
    //   description: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
    //     defaultValue: new Date
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: new Date
    //   }
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('teams');
  }
}; 