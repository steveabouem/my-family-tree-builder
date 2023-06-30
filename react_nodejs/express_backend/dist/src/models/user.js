"use strict";
// 'use strict';
// const {
//   Model
// } = require('sequelize');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       User.belongsToMany(models.Household, { through: 'HouseholdMembers' });
//     }
//   }
//   User.init({
//     email: DataTypes.STRING,
//     first_name: DataTypes.STRING,
//     last_name: DataTypes.STRING,
//     password: {
//       type: DataTypes.STRING,
//       set(value) {
//         this.setDataValue('password', hash(value));
//       }
//     },
//     roles: DataTypes.JSON,
//     tasks: DataTypes.JSON,
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class User extends sequelize_1.Model {
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
    get userId() {
        return this.id;
    }
    get userEmail() {
        return this.email;
    }
    get userFirstName() {
        return this.first_name;
    }
    get userLastName() {
        return this.last_name;
    }
    get userPassword() {
        return this.password;
    }
    get userRoles() {
        return this.roles;
    }
    get userTasks() {
        return this.tasks;
    }
    get userCreatedAt() {
        return this.created_at;
    }
    get userUpdatedBy() {
        return this.updated_by;
    }
    get userUpdatedAt() {
        return this.updated_at;
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    created_at: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: new Date().toUTCString()
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: sequelize_1.DataTypes.JSON
    },
    tasks: {
        type: sequelize_1.DataTypes.JSON
    },
    updated_at: {
        type: sequelize_1.DataTypes.STRING
    },
    updated_by: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'Users',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = User;
