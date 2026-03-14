import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,
  ForeignKey
} from 'sequelize';

import sequelize from "../../db";
import User from './User';
import FamilyTree from './FamilyTree';
import { Gender, MemberVisibility } from '../services/types';

// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends Model<InferAttributes<FamilyMember>, InferCreationAttributes<FamilyMember>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare invite_status: 'pending' | 'accepted' | 'revoked' | null;
  declare verified_by_user: boolean;
  declare email: string | null;
  declare description: string | null;
  declare dob: string;
  declare dod: string | null;
  declare deceased: boolean;
  declare first_name: string;
  declare last_name: string;
  declare gender: Gender;
  declare visibility: MemberVisibility;
  declare marital_status: string | null;
  declare node_id: string;
  declare occupation: string | null;
  declare profile_url: string | null;
  declare tree_id: ForeignKey<FamilyTree['id']>;
  declare user_id: ForeignKey<User['id']> | null;
  declare created_at: CreationOptional<Date>;
  declare created_by_id: ForeignKey<User['id']>;
  declare updated_at: CreationOptional<Date>;
}

FamilyMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: { type: DataTypes.STRING, allowNull: false },
    node_id: { type: DataTypes.STRING, allowNull: false },
    tree_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deceased: { type: DataTypes.BOOLEAN, allowNull: false },
    verified_by_user: { type: DataTypes.BOOLEAN, allowNull: false },// i.e. has the person confirmed the filiation?
    invite_status: { type: DataTypes.ENUM('pending', 'accepted', 'revoked') },
    user_id: { type: DataTypes.INTEGER },
    occupation: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
    dod: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    marital_status: { type: DataTypes.STRING },
    profile_url: { type: DataTypes.BLOB('long') },
    description: { type: DataTypes.TEXT },
    visibility: { type: DataTypes.ENUM('public', 'family_only', 'private') },
    created_by_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    tableName: 'family_members',
    sequelize // passing the `sequelize` instance is required
  }
);


export default FamilyMember;