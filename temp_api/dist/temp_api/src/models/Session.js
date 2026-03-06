"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Session extends sequelize_1.Model {
    get sessionId() {
        return this.id;
    }
    get sessionKey() {
        return this.key;
    }
    get sessionCreatedAt() {
        return this.createdAt;
    }
    get sessionUpdatedAt() {
        return this.updatedAt;
    }
}
Session.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    key: { type: sequelize_1.DataTypes.STRING },
    user_id: { type: sequelize_1.DataTypes.INTEGER },
    time: { type: sequelize_1.DataTypes.DATE },
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
    tableName: 'Sessions',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Session;
