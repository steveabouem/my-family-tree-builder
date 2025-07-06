"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FTIP extends sequelize_1.Model {
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FTIPId() {
        return this.id;
    }
    get FTIPValue() {
        return this.value;
    }
    get FTIPOwners() {
        return this.owners;
    }
}
FTIP.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    value: { type: sequelize_1.DataTypes.STRING },
    owners: { type: sequelize_1.DataTypes.JSON },
}, {
    timestamps: false,
    tableName: 'ip_addresses',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = FTIP;
