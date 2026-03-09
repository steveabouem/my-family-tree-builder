/*
* A Collaborator is the association between a FamilyMember and a FamilyTree.
* It defines the permissions of a given Familymember record for any tree it might be part of
*/
import {
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional, ForeignKey
} from 'sequelize';
import db from '../../db';
import FamilyTree from './FamilyTree';
import User from './User';

export class Collaborator extends Model<
  InferAttributes<Collaborator>,
  InferCreationAttributes<Collaborator>
> {
  declare id: CreationOptional<number>;
  declare treeId: ForeignKey<FamilyTree['id']>;
  declare userId: ForeignKey<User['id']>;
  declare role: 'owner' | 'editor' | 'viewer';
  declare invitedByUserId: ForeignKey<User['id']> | null;
  declare inviteStatus: 'pending' | 'accepted' | 'revoked';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Collaborator.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    treeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    role: {
      type: DataTypes.ENUM('owner', 'editor', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    invitedByUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    inviteStatus: {
      type: DataTypes.ENUM('pending', 'accepted', 'revoked'),
      defaultValue: 'pending',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db, tableName: 'collaborators' }
);

export default Collaborator;