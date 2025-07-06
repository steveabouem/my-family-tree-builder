"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const FamilyTree_1 = __importDefault(require("./FamilyTree"));
// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends sequelize_1.Model {
    /**
     *  Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FamilyMemberId() {
        return this.id;
    }
    get FamilyMemberNodeId() {
        return this.node_id;
    }
    get FamilyMemberUserId() {
        return this.user_id;
    }
    get familyMemberAge() {
        return this.age;
    }
    ;
    get familyMemberDOB() {
        return this.dob;
    }
    ;
    get familyMemberDOD() {
        return this.dod;
    }
    ;
    get familyMemberDescription() {
        return this.description;
    }
    ;
    get familyMemberFirstName() {
        return this.first_name;
    }
    ;
    get familyMemberLastName() {
        return this.last_name;
    }
    get familymemberGender() {
        return this.gender;
    }
    get familyMemberParents() {
        return this.parents;
    }
    ;
    get familyMemberEmail() {
        return this.email;
    }
    ;
    get familyMemberMaritalStatus() {
        return this.marital_status;
    }
    ;
    get familyMemberOccupation() {
        return this.occupation;
    }
    ;
    get familyMemberProfileUrl() {
        return this.profile_url;
    }
    ;
    get familyMemberCreatedBy() {
        return this.created_by;
    }
    ;
    get familyMemberCreatedAt() {
        return this.created_at;
    }
    get familyMemberUpdatedAt() {
        return this.updated_at;
    }
}
FamilyMember.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    node_id: { type: sequelize_1.DataTypes.STRING },
    tree_ids: { type: sequelize_1.DataTypes.JSON },
    // allowNull defaults to true
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    age: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    occupation: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    dob: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    dod: { type: sequelize_1.DataTypes.STRING },
    first_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    gender: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    last_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    marital_status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    parents: { type: sequelize_1.DataTypes.JSON },
    spouses: { type: sequelize_1.DataTypes.JSON },
    profile_url: { type: sequelize_1.DataTypes.STRING },
    description: { type: sequelize_1.DataTypes.STRING },
    children: { type: sequelize_1.DataTypes.JSON },
    siblings: { type: sequelize_1.DataTypes.JSON },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: false,
    tableName: 'family_members',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
// Define associations
FamilyMember.belongsToMany(FamilyTree_1.default, {
    through: 'FamilyTreeMembers',
    foreignKey: 'family_member_id',
    otherKey: 'family_tree_id',
    as: 'FamilyTrees'
});
exports.default = FamilyMember;
