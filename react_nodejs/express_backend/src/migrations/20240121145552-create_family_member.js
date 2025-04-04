'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('family_members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      node_id: { type: Sequelize.STRING},
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.INTEGER, allowNull: false },
      dob: {
        type: Sequelize.STRING, allowNull: false
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      marital_status: { type: Sequelize.STRING, allowNull: false },
      occupation: { type: Sequelize.STRING, allowNull: false },
      age: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.STRING },
      parents: { type: Sequelize.INTEGER }, // [mother, father]
      siblings: { type: Sequelize.JSON },
      children: { type: Sequelize.JSON },
      profile_url: { type: Sequelize.STRING },
      created_by: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('family_members');
  }
};