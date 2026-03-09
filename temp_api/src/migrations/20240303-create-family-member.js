'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('family_members', {
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
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      node_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dob: { type: Sequelize.STRING },
      dod: { type: Sequelize.STRING },
      deceased: { type: Sequelize.BOOLEAN },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false
      },
      email: Sequelize.STRING,
      marital_status: Sequelize.STRING,
      occupation: Sequelize.STRING,
      description: Sequelize.TEXT,
      profile_url: Sequelize.STRING,
      isDeceased: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      visibility: {
        type: Sequelize.ENUM('public', 'family_only', 'private'),
        defaultValue: 'family_only'
      },
      verified_by_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_by_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('family_members', 'user_id');
    await queryInterface.removeColumn('family_members', 'tree_id');
    await queryInterface.dropTable('family_members');
  }
};