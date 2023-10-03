"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FTFam extends sequelize_1.Model {
    // FTUser
    // declare getMembers: HasManyGetAssociationsMixin<FTUser>; // Note the null assertions!
    // declare setMembers: HasManySetAssociationsMixin<FTUser, number>;
    // declare addMembers: HasManyAddAssociationsMixin<FTUser, number>;
    // declare removeMembers: HasManyRemoveAssociationsMixin<FTUser, number>;
    // declare hasMembers: HasManyHasAssociationsMixin<FTUser, number>;
    // declare countMembers: HasManyCountAssociationsMixin;
    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    // declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FTFamId() {
        return this.id;
    }
    get FTFamBaseLocation() {
        return this.base_location;
    }
    get FTFamDescription() {
        return this.description;
    }
    get FTFamHead1() {
        return this.head_1;
    }
    get FTFamHead2() {
        return this.head_2;
    }
    get FTFamHeadCount() {
        return this.head_count;
    }
    get FTFamTree() {
        return this.tree;
    }
    get FTFamName() {
        return this.name;
    }
    get FTFamProfileURL() {
        return this.profile_url;
    }
    get FTFamCreatedBy() {
        return this.created_by;
    }
    get FTFamCreatedAt() {
        return this.createdAt;
    }
    get FTFamUpdatedAt() {
        return this.updatedAt;
    }
    get FTFamMembers() {
        return this.members;
    }
}
FTFam.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    base_location: { type: sequelize_1.DataTypes.STRING },
    description: { type: sequelize_1.DataTypes.STRING },
    head_1: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    head_2: { type: sequelize_1.DataTypes.INTEGER },
    head_count: { type: sequelize_1.DataTypes.INTEGER },
    tree: { type: sequelize_1.DataTypes.INTEGER },
    profile_url: { type: sequelize_1.DataTypes.STRING },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    members: {
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
    tableName: 'FTFams',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
// FTFam.hasMany(FTUser, {
//   as: 'users',
//   foreignKey: 'members'
// });
exports.default = FTFam;
