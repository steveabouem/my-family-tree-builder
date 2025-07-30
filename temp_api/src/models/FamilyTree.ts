import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,CreationOptional, NonAttribute
} from 'sequelize';
import db from "../../db";
import FamilyMember from "./FamilyMember";

// order of InferAttributes & InferCreationAttributes is important.
class FamilyTree extends Model<InferAttributes<FamilyTree>, InferCreationAttributes<FamilyTree>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare authorized_ips: string;
  declare public: number;
  declare name: string;
  declare active: number;
  declare members: string; // Store as JSON in DB, but expose as string[], list of node_ids
  declare emails: string; // email[]
  declare created_by: number; //User
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

FamilyTree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authorized_ips: {
      type: DataTypes.JSON
    },
     members: {
      type: DataTypes.JSON
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emails: {
      type: DataTypes.JSON,
      allowNull: false
    },
    public: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.INTEGER,
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