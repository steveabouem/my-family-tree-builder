"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const FamilyMember_1 = __importDefault(require("./FamilyMember"));
// order of InferAttributes & InferCreationAttributes is important.
class FamilyTree extends sequelize_1.Model {
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FamilytreeId() {
        return this.id;
    }
    get familyTreeAuthorized_ips() {
        return this.authorized_ips;
    }
    ;
    get familyTreePublic() {
        return this.public;
    }
    ;
    get familyTreeName() {
        return this.name;
    }
    ;
    get familyTreeCreated_by() {
        return this.created_by;
    }
    get familyTreeMembers() {
        // Convert JSON data to FamilyMember instances
        if (!this.members)
            return [];
        const membersData = typeof this.members === 'string'
            ? JSON.parse(this.members)
            : this.members;
        return membersData.map((memberData) => {
            const member = new FamilyMember_1.default();
            Object.assign(member, memberData);
            return member;
        });
    }
    get familytreeActive() {
        return this.active;
    }
    get familyTreeCreatedAt() {
        return this.created_at;
    }
    get familyTreeUpdatedAt() {
        return this.updated_at;
    }
    // Custom setter for members
    set familyTreeMembers(members) {
        this.members = members.map(member => member.toJSON());
    }
}
FamilyTree.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    authorized_ips: {
        type: sequelize_1.DataTypes.JSON
    },
    members: {
        type: sequelize_1.DataTypes.JSON
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    public: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
    active: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'family_trees',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = FamilyTree;
