'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('collaborators', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      tree_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'family_trees', key: 'id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('owner', 'editor', 'viewer'),
        allowNull: false,
        defaultValue: 'viewer'
      },
      invited_by_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      invite_status: {
        type: Sequelize.ENUM('pending', 'accepted', 'revoked'),
        allowNull: false,
        defaultValue: 'pending'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    await queryInterface.addIndex('collaborators', ['tree_id']);
    await queryInterface.addIndex('collaborators', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('collaborators', 'invited_by_user_id');
    await queryInterface.removeColumn('collaborators', 'user_id');
    await queryInterface.removeColumn('collaborators', 'tree_id');
    await queryInterface.dropTable('collaborators');
  }
};