'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('projects', {
    //   id: {
    //     autoIncrement: true,
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     allowNull: false,
    //   },
    //   goal: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   budget: {
    //     allowNull: false,
    //     type: Sequelize.DECIMAL(10, 2)
    //   },
    //   expenses: {
    //     allowNull: false,
    //     type: Sequelize.JSON,
    //     defaultValue: []
    //   },
    //   projectLead: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
    //   },
    //   teams: {
    //     allowNull: false,
    //     type: Sequelize.JSON,
    //     defaultValue: []
    //   },
    //   status: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
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
    // await queryInterface.dropTable('projects');
  }
}; 