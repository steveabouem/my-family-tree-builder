'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the table exists and has the wrong schema
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('Sessions')
    );

    if (tableExists) {
      // Drop the existing table to recreate with correct schema
      await queryInterface.dropTable('Sessions');
    }

    // Create the table with correct schema
    await queryInterface.createTable('Sessions', {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      expires: {
        allowNull: false,
        type: Sequelize.DATE // Proper datetime type for MySQL
      },
      data: {
        type: Sequelize.TEXT // TEXT for larger session data
      }
    });

    // Add index for better performance on expiration checks
    await queryInterface.addIndex('Sessions', ['expires'], {
      name: 'idx_sessions_expires'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
}; 