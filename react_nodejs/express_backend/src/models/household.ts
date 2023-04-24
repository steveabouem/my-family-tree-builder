// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Household extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Household.belongsToMany(models.User, { through: 'HouseholdMembers' });
//       Household.hasMany(models.Objective);
//     }
//   }
//   Household.init({
//     budget: DataTypes.INTEGER,
//     created_by: DataTypes.INTEGER,
//     description: DataTypes.STRING,
//     expenses: DataTypes.INTEGER,
//     head_1: DataTypes.INTEGER, //User
//     head_2: DataTypes.INTEGER, //User
//     name: DataTypes.STRING,
//     profile_url: DataTypes.STRING,
//     updated_by: DataTypes.INTEGER,
//   }, {
//     sequelize,
//     modelName: 'Household',
//   });
//   return Household;
// };


import {
  Association, DataTypes, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute,
  HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyRemoveAssociationsMixin,
  HasManyHasAssociationsMixin, HasManyCountAssociationsMixin,
} from 'sequelize';
import db from "../db";
import Objective from './objective';
import User from './user';


// order of InferAttributes & InferCreationAttributes is important.
class Household extends Model<InferAttributes<Household>, InferCreationAttributes<Household>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare budget: number;
  declare description: string;
  declare expenses: number;
  declare head_1: number; //FTUser
  declare head_2: number; //FTUser
  declare name: string;
  declare profile_url: string;
  declare created_by: number;
  declare updated_by: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  /**
   * End
   * */


  /**
   * Association Getters/Setters
   * */
  // User
  declare getMembers: HasManyGetAssociationsMixin<User>; // Note the null assertions!
  declare setMembers: HasManySetAssociationsMixin<User, number>;
  declare addMembers: HasManyAddAssociationsMixin<User, number>;
  declare removeMembers: HasManyRemoveAssociationsMixin<User, number>;
  declare hasMembers: HasManyHasAssociationsMixin<User, number>;
  declare countMembers: HasManyCountAssociationsMixin;

  // Objective
  declare getObjectives: HasManyGetAssociationsMixin<Objective>; // Note the null assertions!
  declare setObjectives: HasManySetAssociationsMixin<Objective, number>;
  declare addObjectives: HasManyAddAssociationsMixin<Objective, number>;
  declare removeObjectives: HasManyRemoveAssociationsMixin<Objective, number>;
  declare hasObjectives: HasManyHasAssociationsMixin<Objective, number>;
  declare countObjectives: HasManyCountAssociationsMixin;
  /**
   * End
   * */

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare objectives?: NonAttribute<Objective[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare members?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get householdId(): NonAttribute<number> {
    return this.id;
  }
  get householdDescription(): NonAttribute<string> {
    return this.description;
  }
  get householdExpenses(): NonAttribute<number> {
    return this.expenses;
  }
  get householdHead_1(): NonAttribute<number> { // User
    return this.head_1;
  }
  get householdHead_2(): NonAttribute<number> { // User
    return this.head_2;
  }
  get householdName(): NonAttribute<string> {
    return this.name;
  }
  get householdProfile_url(): NonAttribute<string> {
    return this.profile_url;
  }
  get householdCreated_by(): NonAttribute<number> { // User
    return this.created_by;
  }
  get householdUpdatedBy(): NonAttribute<number> {
    return this.updated_by;
  }
  get householdCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get householdUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  /**
   * End
   * */

  declare static associations: {
    members: Association<Household, User>;
    objectives: Association<Household, Objective>;
  };
}

Household.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    budget: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING },
    expenses: { type: DataTypes.INTEGER },
    head_1: { type: DataTypes.INTEGER },
    head_2: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    profile_url: { type: DataTypes.STRING },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: new Date().toUTCString()
    },
    updated_at: { type: DataTypes.STRING },

  },
  {
    tableName: 'Households',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Household;