// associations.ts
import User from './models/User';
import FamilyTree from './models/FamilyTree';
import Collaborator from './models/Collaborator';
import Relationship from './models/Relationship';
import FamilyMember from './models/FamilyMember';
import Invite from './models/Invite';
import Notification from './models/Notification';

// User ↔ FamilyTree
User.hasMany(FamilyTree, { foreignKey: 'createdById', as: 'createdTrees' });
FamilyTree.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

// FamilyTree ↔ Collaborator
FamilyTree.hasMany(Collaborator, { foreignKey: 'treeId', as: 'members' });
Collaborator.belongsTo(FamilyTree, { foreignKey: 'treeId', as: 'FamilyTree' });

// User ↔ Collaborator
User.hasMany(Collaborator, { foreignKey: 'userId', as: 'linkedMembers' });
Collaborator.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// FamilyTree ↔ FamilyMember ↔ Collaborator
FamilyTree.hasMany(FamilyMember, { foreignKey: 'treeId', as: 'treeMembers' });
FamilyMember.belongsTo(FamilyTree, { foreignKey: 'treeId', as: 'FamilyTree' });

Collaborator.hasMany(FamilyMember, { foreignKey: 'memberId', as: 'treeMemberships' });
FamilyMember.belongsTo(Collaborator, { foreignKey: 'memberId', as: 'member' });

// User ↔ FamilyMember (inviter)
User.hasMany(FamilyMember, { foreignKey: 'invitedByUserId', as: 'sentTreeMemberships' });
FamilyMember.belongsTo(User, { foreignKey: 'invitedByUserId', as: 'inviter' });

// FamilyTree ↔ Relationship
FamilyTree.hasMany(Relationship, { foreignKey: 'treeId', as: 'relationships' });
Relationship.belongsTo(FamilyTree, { foreignKey: 'treeId', as: 'FamilyTree' });

// Collaborator ↔ Relationship (source/target)
Collaborator.hasMany(Relationship, { foreignKey: 'sourceMemberId', as: 'outgoingRelationships' });
Collaborator.hasMany(Relationship, { foreignKey: 'targetMemberId', as: 'incomingRelationships' });
Relationship.belongsTo(Collaborator, { foreignKey: 'sourceMemberId', as: 'sourceMember' });
Relationship.belongsTo(Collaborator, { foreignKey: 'targetMemberId', as: 'targetMember' });

// User ↔ Invite
User.hasMany(Invite, { foreignKey: 'invitedByUserId', as: 'sentInvites' });
Invite.belongsTo(User, { foreignKey: 'invitedByUserId', as: 'inviter' });

// FamilyTree ↔ Invite
FamilyTree.hasMany(Invite, { foreignKey: 'treeId', as: 'invites' });
Invite.belongsTo(FamilyTree, { foreignKey: 'treeId', as: 'FamilyTree' });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });