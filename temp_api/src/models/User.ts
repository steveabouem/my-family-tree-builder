import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';

import db from "../../db";


// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare status: number;
  declare first_name: string;
  declare last_name: string;
  declare age: number | null;
  declare dob: string;
  declare role_id: number;
  declare occupation: string;
  declare marital_status: string;
  declare assigned_ips: string[]; //each User has one or more ip assigned to them. ips can be shared between multiple. model: FTIP"
  declare description: string;
  declare email: string;
  declare gender: number; // 1:m 2:f"
  declare has_ipa: CreationOptional<number>; //has authority to update authorized ips"
  declare profile_url: CreationOptional<string>;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // declare leadership: number[];
  // declare teams: number[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    dob: {
      type: DataTypes.STRING,
    },
    assigned_ips: {
      type: DataTypes.JSON,
      allowNull: false
    },
    marital_status: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    has_ipa: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    profile_url: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export default User;