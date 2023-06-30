"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Household extends sequelize_1.Model {
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get householdId() {
        return this.id;
    }
    get householdDescription() {
        return this.description;
    }
    get householdExpenses() {
        return this.expenses;
    }
    get householdHead_1() {
        return this.head_1;
    }
    get householdHead_2() {
        return this.head_2;
    }
    get householdName() {
        return this.name;
    }
    get householdProfile_url() {
        return this.profile_url;
    }
    get householdCreated_by() {
        return this.created_by;
    }
    get householdUpdatedBy() {
        return this.updated_by;
    }
    get householdCreatedAt() {
        return this.created_at;
    }
    get householdUpdatedAt() {
        return this.updated_at;
    }
}
Household.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    budget: { type: sequelize_1.DataTypes.INTEGER },
    description: { type: sequelize_1.DataTypes.STRING },
    expenses: { type: sequelize_1.DataTypes.INTEGER },
    head_1: { type: sequelize_1.DataTypes.INTEGER },
    head_2: { type: sequelize_1.DataTypes.INTEGER },
    name: { type: sequelize_1.DataTypes.STRING },
    profile_url: { type: sequelize_1.DataTypes.STRING },
    created_by: { type: sequelize_1.DataTypes.INTEGER },
    updated_by: { type: sequelize_1.DataTypes.INTEGER },
    created_at: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: new Date().toUTCString()
    },
    updated_at: { type: sequelize_1.DataTypes.STRING },
}, {
    tableName: 'Households',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Household;
