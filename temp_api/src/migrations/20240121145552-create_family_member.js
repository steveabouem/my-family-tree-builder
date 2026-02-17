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
      node_id: { type: Sequelize.STRING, allowNull: false },
      tree_ids: { type: Sequelize.STRING },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.INTEGER, allowNull: false },
      dob: { type: Sequelize.STRING},
      dod: { type: Sequelize.STRING },
      user_id: { type: Sequelize.INTEGER }, // not all members created an account
      email: { type: Sequelize.STRING, allowNull: false },
      marital_status: { type: Sequelize.STRING },
      occupation: { type: Sequelize.STRING },
      age: { type: Sequelize.INTEGER },
      description: { type: Sequelize.STRING },
      parents: { type: Sequelize.JSON }, // node_id[]
      siblings: { type: Sequelize.JSON }, // node_id[]
      children: { type: Sequelize.JSON },// node_id[]
      spouses: { type: Sequelize.JSON },// node_id[]
      position: { type: Sequelize.JSON },// {x: number, y: number}
      connections: { type: Sequelize.JSON },// {id: string; source: string; target: string}[]
      profile_url: { type: Sequelize.STRING },
      created_by: { type: Sequelize.INTEGER }, //user
      updated_by: { type: Sequelize.INTEGER }, //user
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('family_members');
  }
};