'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invites', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      invited_by_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'revoked', 'expired'),
        allowNull: false,
        defaultValue: 'pending'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    await queryInterface.addIndex('invites', ['email']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('invites', 'invited_by_user_id');
    await queryInterface.removeColumn('invites', 'tree_id');
    await queryInterface.dropTable('invites');
  }
};