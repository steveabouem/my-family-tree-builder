'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('family_trees', 'members', {
          type: Sequelize.DataTypes.JSON
        }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.sequelize.transaction(t => {
    //   queryInterface.removeColumn('family_trees', 'members', { transaction: t });
    // });
  }
}
