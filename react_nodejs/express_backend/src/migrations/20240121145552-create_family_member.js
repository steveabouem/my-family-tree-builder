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
      age:{ type: Sequelize.INTEGER, allowNull: false},
      description:{ type: Sequelize.STRING},
      first_name:{ type: Sequelize.STRING, allowNull: false},
      gender:{ type: Sequelize.INTEGER, allowNull: false},
      parent_1:{ type: Sequelize.INTEGER}, // mother
      parent_2:{ type: Sequelize.INTEGER},
      email:{ type: Sequelize.STRING},
      last_name:{ type: Sequelize.STRING, allowNull: false},
      tree_id:{ type: Sequelize.INTEGER},
      marital_status:{ type: Sequelize.STRING},
      occupation:{ type: Sequelize.STRING},
      partner:{ type: Sequelize.INTEGER},
      profile_url:{ type: Sequelize.STRING},
      created_by:{ type: Sequelize.INTEGER},
      created_at:{ type: Sequelize.DATE},
      updated_at:{ type: Sequelize.DATE}
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('family_members');
  }
};