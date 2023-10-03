"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FTSession extends sequelize_1.Model {
    get FTSessionId() {
        return this.id;
    }
    get FTSessionKey() {
        return this.key;
    }
    get FTSessionCreatedAt() {
        return this.createdAt;
    }
    get FTSessionUpdatedAt() {
        return this.updatedAt;
    }
}
FTSession.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    key: { type: sequelize_1.DataTypes.STRING },
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
    tableName: 'FTSessions',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = FTSession;
