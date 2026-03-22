import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,
  NonAttribute,
  Association} from 'sequelize';

import sequelize from "../../db";
import FamilyTree from './FamilyTree';
import FamilyMember from './FamilyMember';
import { Gender } from '../services/types';


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
  declare occupation: string;
  declare marital_status: string;
  declare description: string;
  declare email: string;
  declare gender: Gender;
  declare profile_url: CreationOptional<string>;
  declare password: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

   // associations
  declare trees?: NonAttribute<FamilyTree[]>;
  declare members?: NonAttribute<FamilyMember[]>;

  static associations: {
    trees: Association<User, FamilyTree>;
    members: Association<User, FamilyMember>;
  };

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    sequelize // passing the `sequelize` instance is required
  }
);

export default User;