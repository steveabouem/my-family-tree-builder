"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class User extends sequelize_1.Model {
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get userId() {
        return this.id;
    }
    get userAge() {
        return this.age;
    }
    get userDOB() {
        return this.dob;
    }
    get userParent_1() {
        return this.role_id;
    }
    get userEmail() {
        return this.email;
    }
    get userAssigned_ip() {
        return this.assigned_ips;
    }
    get userDescription() {
        return this.description;
    }
    get userFirst_name() {
        return this.first_name;
    }
    get userGender() {
        return this.gender;
    }
    get userHas_ipa() {
        return this.has_ipa;
    }
    get userLastName() {
        return this.last_name;
    }
    get UserOccupation() {
        return this.occupation;
    }
    get UserProfileURL() {
        return this.profile_url;
    }
    get UserPassword() {
        return this.password;
    }
    get UserRole() {
        return this.role_id;
    }
    get UserRelatedTo() {
        return this.related_to;
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    dob: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    assigned_ips: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    has_ipa: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: sequelize_1.DataTypes.STRING,
    },
    profile_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    related_to: {
        type: sequelize_1.DataTypes.JSON
    },
    role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
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
    tableName: 'users',
    sequelize: db_1.default, // passing the `sequelize` instance is required
});
exports.default = User;
