"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends sequelize_1.Model {
}
FamilyMember.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    node_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    tree_ids: { type: sequelize_1.DataTypes.JSON },
    // allowNull defaults to true
    user_id: { type: sequelize_1.DataTypes.INTEGER },
    age: { type: sequelize_1.DataTypes.INTEGER },
    occupation: { type: sequelize_1.DataTypes.STRING },
    dob: { type: sequelize_1.DataTypes.STRING },
    dod: { type: sequelize_1.DataTypes.STRING },
    first_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    gender: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING },
    last_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    marital_status: { type: sequelize_1.DataTypes.STRING },
    parents: { type: sequelize_1.DataTypes.JSON },
    spouses: { type: sequelize_1.DataTypes.JSON },
    position: { type: sequelize_1.DataTypes.JSON },
    connections: { type: sequelize_1.DataTypes.JSON },
    profile_url: { type: sequelize_1.DataTypes.BLOB('long') },
    description: { type: sequelize_1.DataTypes.STRING },
    children: { type: sequelize_1.DataTypes.JSON },
    siblings: { type: sequelize_1.DataTypes.JSON },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: false,
    tableName: 'family_members',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = FamilyMember;
