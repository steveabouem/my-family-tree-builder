"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Project extends sequelize_1.Model {
}
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    cost: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    budget: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    deadline: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    lead: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    team: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    timestamps: false,
    tableName: 'projects',
    sequelize: db_1.default
});
exports.default = Project;
