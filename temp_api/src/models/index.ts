import sequelize  from '../../db';
import User from './User';
import FamilyTree from './FamilyTree';
import FamilyMember from './FamilyMember';
import Collaborator from './Collaborator';
import Relationship from './Relationship';
import Invite from './Invite';
import Notification from './Notification';

// ! Associations must be applied AFTER all models are imported
import '../associations';

export {
  sequelize,
  User,
  FamilyTree,
  FamilyMember,
  Collaborator,
  Relationship,
  Invite,
  Notification
};