import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,CreationOptional, NonAttribute,
  ForeignKey,
  Association
} from 'sequelize';

import db from "../../db";
import FamilyMember from "./FamilyMember";
import User from './User';

// order of InferAttributes & InferCreationAttributes is important.
class FamilyTree extends Model<InferAttributes<FamilyTree>, InferCreationAttributes<FamilyTree>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare visibility: 'public' | 'private' | 'invite_only';
  declare name: string;
  declare active: boolean;
  declare default_generation_depth: number;
  declare default_anchor_family_member_id: ForeignKey<FamilyMember['id']>;
  declare created_by_id: number;
  declare updated_by: ForeignKey<User['id']>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

   // associations
  declare members?: NonAttribute<FamilyMember[]>;

  static associations: {
    members: Association<FamilyTree, FamilyMember>;
  };

}

FamilyTree.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    created_by_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'invite_only'),
      allowNull: false,
      defaultValue: 'private',
    },
    default_generation_depth: {
      type: DataTypes.INTEGER
    },
    default_anchor_family_member_id: {
      type: DataTypes.INTEGER
    },
    updated_at: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'family_trees',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default FamilyTree;