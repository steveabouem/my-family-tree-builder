'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('roles', [
      {
        name: "user",
        permissions: JSON.stringify(
          ["canViewTree", "canCreateTree", "canChangeTreePrivacy"]
        )
      },
      {
        name: "familyMember",
        permissions: JSON.stringify(
          [
            "canViewTree", "canCreateTree", "canChangeTreePrivacy",
            "canEditTree", "canChangeTreeStatus"
          ]
        )
      },
      {
        name: "guest",
        permissions: null
        
      },
      {
        name: "admin",
        permissions: JSON.stringify(
          [
            "canViewProject", "canCreateProject", "canEditProject",
            "canChangeProjectStatus", "canViewTree", "canCreateTree",
            "canEditTree", "canChangeTreeStatus", "canChangeTreePrivacy",
            "canViewMeetings", "canCreateMeetings", "canEditMeetings",
            "canChangeMeetingsStatus", "canChangeMeetingsPrivacy",
            "canViewComittee", "canCreateComittee", "canEditComittee",
            "canChangeComitteeStatus", "canActAsAdmin", "canViewUser",
            "canCreateUser", "canEditUser", "canChangeUserStatus"
          ])
      },
      {
        name: "comitteeMember",
        permissions: null
        
      },
      {
        name: "comitteeLead",
        permissions: null
        
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('roles', null, {})
  }
};
