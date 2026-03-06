"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../db"));
class Role extends sequelize_1.Model {
    get roleId() {
        return this.id;
    }
    get roleName() {
        return this.name;
    }
    get rolePermissions() {
        return this.permissions;
    }
}
Role.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: sequelize_1.DataTypes.JSON
    }
}, {
    timestamps: false,
    tableName: 'roles',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Role;
