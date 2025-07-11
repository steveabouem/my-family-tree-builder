'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('permissions', [
      { name: 'canViewProject' },
      { name: 'canCreateProject' },
      { name: 'canEditProject' },
      { name: 'canChangeProjectStatus' },
      { name: 'canViewUser' },
      { name: 'canCreateUser' },
      { name: 'canEditUser' },
      { name: 'canChangeUserStatus' },
      { name: 'canViewTree' },
      { name: 'canCreateTree' },
      { name: 'canEditTree' },
      { name: 'canChangeTreeStatus' },
      { name: 'canChangeTreePrivacy' },
      { name: 'canViewMeetings' },
      { name: 'canCreateMeetings' },
      { name: 'canEditMeetings' },
      { name: 'canChangeMeetingsStatus' },
      { name: 'canChangeMeetingsPrivacy' },
      { name: 'canViewComittee' },
      { name: 'canCreateComittee' },
      { name: 'canEditComittee' },
      { name: 'canChangeComitteeStatus' },
      { name: 'canActAsAdmin' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('permissions', null, {});
  }
};
