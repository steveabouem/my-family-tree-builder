import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from "../../db";
import FamilyTree from './FamilyTree';
import FamilyMember  from './FamilyMember';

class Relationship extends Model<
  InferAttributes<Relationship>,
  InferCreationAttributes<Relationship>
> {
  declare id: CreationOptional<number>;
  declare tree_id: ForeignKey<FamilyTree['id']>;
  declare source_family_member_id: ForeignKey<FamilyMember['id']>;
  declare target_family_member_id: ForeignKey<FamilyMember['id']>;
  declare type: 'parent' | 'child' | 'spouse' | 'sibling';
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Relationship.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    tree_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    source_family_member_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    target_family_member_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: {
      type: DataTypes.ENUM('parent', 'child', 'spouse', 'sibling'),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize, tableName: 'relationships', timestamps: false }
);

export default Relationship;