// 'use strict';
// const {
//   Model
// } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Objective extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       Objective.belongsTo(models.Household);
//       Objective.hasMany(models.Task);
//     }
//   }
//   Objective.init({
//     name: DataTypes.STRING,
//     created_by: DataTypes.INTEGER,
//     description: DataTypes.STRING,
//     expenses: DataTypes.INTEGER,
//     budget: DataTypes.INTEGER,
//     created_by: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Objective',
//   });
//   return Objective;
// };


import {
  Association, DataTypes, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute,
  HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyRemoveAssociationsMixin,
  HasManyHasAssociationsMixin, HasManyCountAssociationsMixin,
} from 'sequelize';
import db from "../db";
import Household from './household';
import Task from './task';


// order of InferAttributes & InferCreationAttributes is important.
class Objective extends Model<InferAttributes<Objective, { omit: 'tasks' }>, InferCreationAttributes<Objective>> {
  // TODO: Objective status will be calculated in the service by the sum of related tasks statuses
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare expenses: number;
  declare budget: number;
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
  // Task
  declare getTasks: HasManyGetAssociationsMixin<Task>; // Note the null assertions!
  declare setTasks: HasManySetAssociationsMixin<Task, number>;
  declare addTasks: HasManyAddAssociationsMixin<Task, number>;
  declare removeTasks: HasManyRemoveAssociationsMixin<Task, number>;
  declare hasTasks: HasManyHasAssociationsMixin<Task, number>;
  declare countTasks: HasManyCountAssociationsMixin;

  // Household
  declare getHousehold: HasManyGetAssociationsMixin<Household>; // Note the null assertions!
  declare setHousehold: HasManySetAssociationsMixin<Household, number>;
  declare addHousehold: HasManyAddAssociationsMixin<Household, number>;
  declare removeHousehold: HasManyRemoveAssociationsMixin<Household, number>;
  declare hasHousehold: HasManyHasAssociationsMixin<Household, number>;
  declare countHousehold: HasManyCountAssociationsMixin;
  /**
   * End
   * */

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare household?: NonAttribute<Objective[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare tasks?: NonAttribute<Task[]>; // Note this is optional since it's only populated when explicitly requested in code

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get householdId(): NonAttribute<number> {
    return this.id;
  }
  get objectiveName(): NonAttribute<string> {
    return this.name;
  }
  get objectiveDescription(): NonAttribute<string> {
    return this.description;
  }
  get objectiveExpenses(): NonAttribute<number> { //budget = planned, expense = observed
    return this.expenses;
  }
  get objectiveBudget(): NonAttribute<number> {
    return this.budget;
  }
  get objectiveCreated_by(): NonAttribute<number> {
    return this.created_by;
  }
  get objectiveUpdatedBy(): NonAttribute<number> {
    return this.updated_by;
  }
  get objectiveCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get objectiveUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  /**
   * End
   * */

  declare static associations: {
    tasks: Association<Objective, Task>;
    household: Association<Objective, Household>;
  };
}

Objective.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expenses: {
      type: DataTypes.INTEGER
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: new Date().toUTCString()
    },
    updated_at: {
      type: DataTypes.STRING
    }

  },
  {
    tableName: 'Objectives',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Objective;