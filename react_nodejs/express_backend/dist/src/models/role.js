"use strict";
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Role extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Role.belongsToMany(models.User, { through: 'UserRoles' });
//     }
//   }
//   Role.init({
//     assigned: DataTypes.BOOLEAN,
//     code: DataTypes.STRING, // 3: admin (tracker/FT), 2:user (tracker)
//   }, {
//     sequelize,
//     modelName: 'Role',
//   });
//   return Role;
// };
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Role extends sequelize_1.Model {
    /**
     * End
     * */
    /**
     * Association Getters/Setters
     * */
    /**
     * End
     * */
    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    // declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get roleId() {
        return this.id;
    }
    get roleCode() {
        return this.code;
    }
    get roleAssigned() {
        return this.assigned;
    }
}
Role.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    assigned: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Roles',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Role;
