'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('FTUsers', 'parent_1', {
          type: Sequelize.DataTypes.INTEGER // FTUser.id
        }, { transaction: t }),
        queryInterface.addColumn('FTUsers', 'parent_2', {
          type: Sequelize.DataTypes.INTEGER // FTUser.id,
        }, { transaction: t })
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('FTUsers', 'parent_1', { transaction: t }),
        queryInterface.removeColumn('FTUsers', 'parent_2', { transaction: t })
      ]);
    });
  }
};
