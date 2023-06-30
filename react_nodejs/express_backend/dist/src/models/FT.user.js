"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FTUser extends sequelize_1.Model {
    // // FTFAM
    // declare getFamilies: HasManyGetAssociationsMixin<FTFam>; // Note the null assertions!
    // declare setFamilies: HasManySetAssociationsMixin<FTFam, number>;
    // declare addFamilies: HasManyAddAssociationsMixin<FTFam, number>;
    // declare removeFamilies: HasManyRemoveAssociationsMixin<FTFam, number>;
    // declare hasFamilies: HasManyHasAssociationsMixin<FTFam, number>;
    // declare countFamilies: HasManyCountAssociationsMixin;
    // FTIP
    // declare getIP: HasManyGetAssociationsMixin<FTIP>; // Note the null assertions!
    // declare setIP: HasManySetAssociationsMixin<FTIP, string[]>;
    // declare addIP: HasManyAddAssociationsMixin<FTIP, string[]>;
    // declare removeIP: HasManyRemoveAssociationsMixin<FTIP, string[]>;
    // declare hasIP: HasManyHasAssociationsMixin<FTIP, string[]>;
    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    // declare families?: NonAttribute<FTFam[]>; // Note this is optional since it's only populated when explicitly requested in code
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FTUserId() {
        return this.id;
    }
    get FTUserAge() {
        return this.age;
    }
    get FTUserEmail() {
        return this.email;
    }
    get FTUserAssigned_ip() {
        return this.assigned_ips;
    }
    get FTUserDescription() {
        return this.description;
    }
    get FTUserFirst_name() {
        return this.first_name;
    }
    get FTUserGender() {
        return this.gender;
    }
    get FTUserHas_ipa() {
        return this.has_ipa;
    }
    get FTUserIsParent() {
        return this.is_parent;
    }
    get FTUserLastName() {
        return this.last_name;
    }
    get FTUserImmediateFamily() {
        return this.imm_family;
    }
    get FTUserMaritalStatus() {
        return this.marital_status;
    }
    get FTUserOccupation() {
        return this.occupation;
    }
    get FTUserPartner() {
        return this.partner;
    }
    get FTUserProfileURL() {
        return this.profile_url;
    }
    get FTUserPassword() {
        return this.password;
    }
    get FTUserRelatedTo() {
        return this.related_to;
    }
}
FTUser.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
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
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    is_parent: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
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
    imm_family: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    marital_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: sequelize_1.DataTypes.STRING,
    },
    partner: {
        type: sequelize_1.DataTypes.INTEGER,
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
    tableName: 'FTUsers',
    sequelize: db_1.default, // passing the `sequelize` instance is required
});
exports.default = FTUser;
