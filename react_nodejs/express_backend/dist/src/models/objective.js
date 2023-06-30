"use strict";
// 'use strict';
// const {
//   Model
// } = require('sequelize');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Objective extends sequelize_1.Model {
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get householdId() {
        return this.id;
    }
    get objectiveName() {
        return this.name;
    }
    get objectiveDescription() {
        return this.description;
    }
    get objectiveExpenses() {
        return this.expenses;
    }
    get objectiveBudget() {
        return this.budget;
    }
    get objectiveCreated_by() {
        return this.created_by;
    }
    get objectiveUpdatedBy() {
        return this.updated_by;
    }
    get objectiveCreatedAt() {
        return this.created_at;
    }
    get objectiveUpdatedAt() {
        return this.updated_at;
    }
}
Objective.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    budget: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    expenses: {
        type: sequelize_1.DataTypes.INTEGER
    },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updated_by: {
        type: sequelize_1.DataTypes.INTEGER
    },
    created_at: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: new Date().toUTCString()
    },
    updated_at: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'Objectives',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Objective;
