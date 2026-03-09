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
  declare tree_id: ForeignKey<FamilyTree['id']>;
  declare user_id: ForeignKey<User['id']>;
  declare role: 'owner' | 'editor' | 'viewer';
  declare invited_by_user_id: ForeignKey<User['id']> | null;
  declare invite_status: 'pending' | 'accepted' | 'revoked';
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Collaborator.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    tree_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    role: {
      type: DataTypes.ENUM('owner', 'editor', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    invited_by_user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    invite_status: {
      type: DataTypes.ENUM('pending', 'accepted', 'revoked'),
      defaultValue: 'pending',
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize: db, tableName: 'collaborators' }
);

export default Collaborator;