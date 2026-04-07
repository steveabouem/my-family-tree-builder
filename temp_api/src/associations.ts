// associations.ts

import User from './models/User';
import FamilyTree from './models/FamilyTree';
import FamilyMember from './models/FamilyMember';
import Collaborator from './models/Collaborator';
import Relationship from './models/Relationship';
import Invite from './models/Invite';
import Notification from './models/Notification';

export enum associationAliases {
  treeMembers = 'tree_members',
  treeCollaborators = 'tree_collaborators',
  userTrees = 'user_trees',
  treeUser = 'tree_user',
  treeInvites = 'tree_invites',
  memberTree = 'member_tree',
  userFamilyMembers = 'user_family_members',
  familyMemberUser = 'family_member_user',
  collaboratorTree = 'collaborator_tree',
  userCollaborator = 'user_collaborator',
  collaboratorUser = 'collaborator_user',
  userCollaboratorInvite = 'user_collaborator_invite',
  collaboratorInvitedBy = 'collaborator_invited_by',
  treeRelationships = 'tree_relationships',
  relationshipTree = 'relationship_tree',
  outgoingRelationships = 'outgoing_relationships',
  incomingRelationships = 'incoming_relationships',
  relationshipFamilyMemberAsSource = 'relationship_family_member_as_source',
  relationshipFamilyMemberAsTarget = 'relationship_family_member_as_target',
  familyTreeInvite = 'family_tree_invite',
  inviteFamilyTree = 'invite_family_tree',
  hasManyInvite = 'has_many_invite',
  inviteUser = 'invite_user',
  hasManyNotification = 'has_many_notification',
  notificationUser = 'notification_user',
}

/* -------------------------------------------------------
   USER ↔ TREE (creator)
------------------------------------------------------- */
// these 2 are unused since I removed this Association. leaving it here because I will most likely revert that change
User.hasMany(FamilyTree, {
  foreignKey: 'created_by_id',
  as: associationAliases.userTrees
});

FamilyTree.belongsTo(User, {
  foreignKey: 'created_by_id',
  as: associationAliases.treeUser
});

/* -------------------------------------------------------
   TREE ↔ FAMILY MEMBERS
------------------------------------------------------- */
FamilyTree.hasMany(FamilyMember, {
  foreignKey: 'tree_id',
  as: associationAliases.treeMembers
});

FamilyMember.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: associationAliases.memberTree
});

/* -------------------------------------------------------
   USER ↔ FAMILY MEMBERS (optional link)
------------------------------------------------------- */
User.hasMany(FamilyMember, {
  foreignKey: 'user_id',
  as: associationAliases.userFamilyMembers
});

FamilyMember.belongsTo(User, {
  foreignKey: 'user_id',
  as: associationAliases.familyMemberUser
});

/* -------------------------------------------------------
   TREE ↔ COLLABORATORS
------------------------------------------------------- */
FamilyTree.hasMany(Collaborator, {
  foreignKey: 'tree_id',
  as: associationAliases.treeCollaborators
});

Collaborator.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: associationAliases.collaboratorTree
});

/* -------------------------------------------------------
   USER ↔ COLLABORATORS
------------------------------------------------------- */
User.hasMany(Collaborator, {
  foreignKey: 'user_id',
  as: associationAliases.userCollaborator
});

Collaborator.belongsTo(User, {
  foreignKey: 'user_id',
  as: associationAliases.collaboratorUser
});

/* -------------------------------------------------------
   USER (inviter) ↔ COLLABORATORS
------------------------------------------------------- */
User.hasMany(Collaborator, {
  foreignKey: 'invited_by_user_id',
  as: associationAliases.userCollaboratorInvite
});

Collaborator.belongsTo(User, {
  foreignKey: 'invited_by_user_id',
  as: associationAliases.collaboratorInvitedBy
});

/* -------------------------------------------------------
   TREE ↔ RELATIONSHIPS
------------------------------------------------------- */
FamilyTree.hasMany(Relationship, {
  foreignKey: 'tree_id',
  as: associationAliases.treeRelationships
});

Relationship.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: associationAliases.relationshipTree
});

/* -------------------------------------------------------
   FAMILY MEMBERS ↔ RELATIONSHIPS (source/target)
------------------------------------------------------- */
FamilyMember.hasMany(Relationship, {
  foreignKey: 'source_family_member_id',
  as: associationAliases.outgoingRelationships
});

FamilyMember.hasMany(Relationship, {
  foreignKey: 'target_family_member_id',
  as: associationAliases.incomingRelationships
});

Relationship.belongsTo(FamilyMember, {
  foreignKey: 'source_family_member_id',
  as: associationAliases.relationshipFamilyMemberAsSource
});

Relationship.belongsTo(FamilyMember, {
  foreignKey: 'target_family_member_id',
  as: associationAliases.relationshipFamilyMemberAsTarget
});

/* -------------------------------------------------------
   TREE ↔ INVITES
------------------------------------------------------- */
FamilyTree.hasMany(Invite, {
  foreignKey: 'tree_id',
  as: associationAliases.familyTreeInvite
});

Invite.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: associationAliases.inviteFamilyTree
});

/* -------------------------------------------------------
   USER ↔ INVITES (inviter)
------------------------------------------------------- */
User.hasMany(Invite, {
  foreignKey: 'invited_by_user_id',
  as: associationAliases.hasManyInvite
});

Invite.belongsTo(User, {
  foreignKey: 'invited_by_user_id',
  as: associationAliases.inviteUser
});

/* -------------------------------------------------------
   USER ↔ NOTIFICATIONS
------------------------------------------------------- */
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: associationAliases.hasManyNotification
});

Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: associationAliases.notificationUser
});