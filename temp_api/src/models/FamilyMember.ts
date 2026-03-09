import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,
  ForeignKey
} from 'sequelize';

import db from "../../db";
import User from './User';
import FamilyTree from './FamilyTree';

// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends Model<InferAttributes<FamilyMember>, InferCreationAttributes<FamilyMember>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare invite_status: 'pending' | 'accepted' | 'revoked';
  declare verified_by_user: boolean;
  declare age: number | null;
  declare children: string; // node_id[]
  declare description: string;
  declare dob: string;
  declare dod: string | null;
  declare deceased: boolean;
  declare first_name: string;
  declare gender: 'male' | 'female' | 'other';
  declare role: 'owner' | 'editor' | 'viewer';
  declare last_name: string;
  declare marital_status: string;
  declare node_id: string;
  declare occupation?: string;
  declare parents: string;
  declare profile_url?: string | undefined;
  declare siblings: string;
  declare spouses: string;
  declare position?: string; //{x: number; y: number};
  declare connections?: string; // {id: string; source: string; target: string}[];
  declare tree_id: ForeignKey<FamilyTree['id']> | null;
  declare user_id: ForeignKey<User['id']> | null;
  declare created_at: CreationOptional<Date>;
  declare created_by: ForeignKey<User['id']>;
  declare updated_at: CreationOptional<Date>;
}

FamilyMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    node_id: { type: DataTypes.STRING, allowNull: false },
    tree_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deceased: { type: DataTypes.BOOLEAN, allowNull: false },
    verified_by_user: { type: DataTypes.BOOLEAN, allowNull: false },
    role: {
      type: DataTypes.ENUM('owner', 'editor', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    invite_status: {type: DataTypes.ENUM('pending', 'accepted', 'revoked')},
    user_id: { type: DataTypes.INTEGER },
    age: { type: DataTypes.INTEGER },
    occupation: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
    dod: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    marital_status: { type: DataTypes.STRING },
    parents: { type: DataTypes.JSON },
    spouses: { type: DataTypes.JSON },
    position: { type: DataTypes.JSON },
    connections: { type: DataTypes.JSON },
    profile_url: { type: DataTypes.BLOB('long') },
    description: { type: DataTypes.STRING },
    children: { type: DataTypes.JSON },
    siblings: { type: DataTypes.JSON },
    created_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
  },
  {
    timestamps: false,
    tableName: 'family_members',
    sequelize: db // passing the `sequelize` instance is required
  }
);


export default FamilyMember;