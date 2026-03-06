"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Session extends sequelize_1.Model {
}
Session.init({
    id: {
        type: sequelize_1.DataTypes.STRING(),
        autoIncrement: true,
        primaryKey: true
    },
    stale_time: { type: sequelize_1.DataTypes.BIGINT, allowNull: false },
    data: { type: sequelize_1.DataTypes.JSON },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    timestamps: false,
    tableName: 'Sessions', // using the default session table. 
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Session;
