'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('relationships', {
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
      source_family_member_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'family_members', key: 'id' },
        onDelete: 'CASCADE'
      },
      target_family_member_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'family_members', key: 'id' },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('parent', 'child', 'spouse', 'sibling'),
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    await queryInterface.addIndex('relationships', ['tree_id']);
    await queryInterface.addIndex('relationships', ['source_family_member_id']);
    await queryInterface.addIndex('relationships', ['target_family_member_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('relationships','tree_id');
    await queryInterface.removeColumn('relationships','target_family_member_id');
    await queryInterface.removeColumn('relationships','source_family_member_id');
    await queryInterface.dropTable('relationships');
  }
};