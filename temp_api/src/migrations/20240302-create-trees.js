'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('family_trees', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_by_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      default_generation_depth: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      visibility: {
        type: Sequelize.ENUM('public', 'private', 'invite_only'),
        allowNull: false,
        defaultValue: 'private'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('family_trees');
  }
};