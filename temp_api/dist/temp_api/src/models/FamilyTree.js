"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FamilyTree extends sequelize_1.Model {
}
FamilyTree.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    authorized_ips: {
        type: sequelize_1.DataTypes.JSON
    },
    members: {
        type: sequelize_1.DataTypes.JSON
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    emails: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false
    },
    public: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
    active: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'family_trees',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = FamilyTree;
