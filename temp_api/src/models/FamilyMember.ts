import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';

import db from "../../db";

// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends Model<InferAttributes<FamilyMember>, InferCreationAttributes<FamilyMember>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare age: number | null;
  declare children: string; // node_id[]
  declare created_at: CreationOptional<Date>;
  declare created_by: number; //User
  declare description: string;
  declare dob: string;
  declare dod: string | null;
  declare email: string | null;
  declare first_name: string;
  declare gender: number; //1:M, 2:F
  declare id: CreationOptional<number>;
  declare last_name: string;
  declare marital_status: string;
  declare node_id: string;
  declare occupation?: string;
  declare parents:string; // node_id[]
  declare profile_url?: string | undefined;
  declare siblings: string; // node_id[]
  declare spouses: string; // node_id[]
  declare position?: string; //{x: number; y: number};
  declare connections?: string; // {id: string; source: string; target: string}[];
  declare tree_ids: string | null;
  declare updated_at: CreationOptional<Date>;
  declare user_id: number | null;
}

FamilyMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    node_id: { type: DataTypes.STRING, allowNull: false },
    tree_ids: { type: DataTypes.JSON },
    // allowNull defaults to true
    user_id: { type: DataTypes.INTEGER},
    age: { type: DataTypes.INTEGER },
    occupation: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
    dod: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING },
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