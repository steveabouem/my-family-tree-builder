'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  //   await queryInterface.createTable('Objectives', {
  //     id: {
  //       allowNull: false,
  //       autoIncrement: true,
  //       primaryKey: true,
  //       type: Sequelize.INTEGER
  //     },
  //     name: {
  //       allowNull: false,
  //       type: Sequelize.STRING
  //     },
  //     created_by: {
  //       allowNull: false,
  //       type: Sequelize.INTEGER
  //     },
  //     description: {
  //       allowNull: false,
  //       type: Sequelize.STRING
  //     },
  //     expenses: {
  //       allowNull: false,
  //       type: Sequelize.INTEGER
  //     },
  //     budget: {
  //       allowNull: false,
  //       type: Sequelize.INTEGER
  //     },
  //     created_by: {
  //       type: Sequelize.INTEGER
  //     },
  //     created_at: {
  //       allowNull: false,
  //       type: Sequelize.DATE
  //     },
  //     updated_at: {
  //       allowNull: false,
  //       type: Sequelize.DATE
  //     },
  //     updated_by: {
  //       type: Sequelize.INTEGER
  //     }
  //   });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('Objectives');
  }
};