// associations.ts

import User from './models/User';
import FamilyTree from './models/FamilyTree';
import FamilyMember from './models/FamilyMember';
import Collaborator from './models/Collaborator';
import Relationship from './models/Relationship';
import Invite from './models/Invite';
import Notification from './models/Notification';

/* -------------------------------------------------------
   USER ↔ TREE (creator)
------------------------------------------------------- */
User.hasMany(FamilyTree, {
  foreignKey: 'created_by_id',
  as: 'createdTrees'
});

FamilyTree.belongsTo(User, {
  foreignKey: 'created_by_id',
  as: 'creator'
});

/* -------------------------------------------------------
   TREE ↔ FAMILY MEMBERS
------------------------------------------------------- */
FamilyTree.hasMany(FamilyMember, {
  foreignKey: 'tree_id',
  as: 'members'
});

FamilyMember.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: 'tree'
});

/* -------------------------------------------------------
   USER ↔ FAMILY MEMBERS (optional link)
------------------------------------------------------- */
User.hasMany(FamilyMember, {
  foreignKey: 'user_id',
  as: 'familyMembers'
});

FamilyMember.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

/* -------------------------------------------------------
   TREE ↔ COLLABORATORS
------------------------------------------------------- */
FamilyTree.hasMany(Collaborator, {
  foreignKey: 'tree_id',
  as: 'collaborators'
});

Collaborator.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: 'tree'
});

/* -------------------------------------------------------
   USER ↔ COLLABORATORS
------------------------------------------------------- */
User.hasMany(Collaborator, {
  foreignKey: 'user_id',
  as: 'collaborations'
});

Collaborator.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

/* -------------------------------------------------------
   USER (inviter) ↔ COLLABORATORS
------------------------------------------------------- */
User.hasMany(Collaborator, {
  foreignKey: 'invited_by_user_id',
  as: 'sentCollaboratorInvites'
});

Collaborator.belongsTo(User, {
  foreignKey: 'invited_by_user_id',
  as: 'inviter'
});

/* -------------------------------------------------------
   TREE ↔ RELATIONSHIPS
------------------------------------------------------- */
FamilyTree.hasMany(Relationship, {
  foreignKey: 'tree_id',
  as: 'relationships'
});

Relationship.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: 'tree'
});

/* -------------------------------------------------------
   FAMILY MEMBERS ↔ RELATIONSHIPS (source/target)
------------------------------------------------------- */
FamilyMember.hasMany(Relationship, {
  foreignKey: 'source_family_member_id',
  as: 'outgoingRelationships'
});

FamilyMember.hasMany(Relationship, {
  foreignKey: 'target_family_member_id',
  as: 'incomingRelationships'
});

Relationship.belongsTo(FamilyMember, {
  foreignKey: 'source_family_member_id',
  as: 'sourceMember'
});

Relationship.belongsTo(FamilyMember, {
  foreignKey: 'target_family_member_id',
  as: 'targetMember'
});

/* -------------------------------------------------------
   TREE ↔ INVITES
------------------------------------------------------- */
FamilyTree.hasMany(Invite, {
  foreignKey: 'tree_id',
  as: 'invites'
});

Invite.belongsTo(FamilyTree, {
  foreignKey: 'tree_id',
  as: 'tree'
});

/* -------------------------------------------------------
   USER ↔ INVITES (inviter)
------------------------------------------------------- */
User.hasMany(Invite, {
  foreignKey: 'invited_by_user_id',
  as: 'sentInvites'
});

Invite.belongsTo(User, {
  foreignKey: 'invited_by_user_id',
  as: 'inviter'
});

/* -------------------------------------------------------
   USER ↔ NOTIFICATIONS
------------------------------------------------------- */
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});

Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});