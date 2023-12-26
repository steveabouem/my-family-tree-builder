'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Sessions', 'time', {
          type: Sequelize.DataTypes.DATE
        }, { transaction: t }),
        queryInterface.addColumn('Sessions', 'user_id', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Sessions', 'time', { transaction: t }),
        queryInterface.removeColumn('Sessions', 'user_id', { transaction: t }),
      ]);
    });
  }
};
