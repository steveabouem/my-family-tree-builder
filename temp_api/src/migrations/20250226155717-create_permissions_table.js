'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
     id: {
       autoIncrement: true,
       type: Sequelize.INTEGER,
       primaryKey: true,
       allowNull: false,
     },
     name: {
       type: Sequelize.STRING,
       unique: true,
       allowNull: false
     }
    })
   },
   async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('permissions');
   }
};
