import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute
} from 'sequelize';
import db from "db";
import FamilyTree from "./FamilyTree";

// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends Model<InferAttributes<FamilyMember>, InferCreationAttributes<FamilyMember>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare node_id?: string;
  declare user_id?: number;
  declare age: number | null;
  declare dob: string;
  declare tree_ids: string | null;
  declare dod: string | null;
  declare description: string;
  declare first_name: string;
  declare gender: number; //1:M, 2:F
  declare parents: string | null;
  declare siblings: string | null;
  declare spouses: string | null;
  declare children: string | null;
  declare email: string;
  declare last_name: string;
  declare marital_status: string;
  declare occupation?: string;
  declare profile_url?: string;
  declare created_by: number; //User
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Associations
  declare FamilyTrees?: NonAttribute<FamilyTree[]>;

  /**
   *  Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FamilyMemberId(): NonAttribute<number> {
    return this.id;
  }
  get FamilyMemberNodeId(): NonAttribute<string | undefined> {
    return this.node_id;
  }
  get FamilyMemberUserId(): NonAttribute<number | undefined> {
    return this.user_id;
  }
  get familyMemberAge(): NonAttribute<number | null> {
    return this.age;
  };
  get familyMemberDOB(): NonAttribute<string> {
    return this.dob;
  };
  get familyMemberDOD(): NonAttribute<string | null> {
    return this.dod;
  };
  get familyMemberDescription(): NonAttribute<string> {
    return this.description;
  };
  get familyMemberFirstName(): NonAttribute<string> {
    return this.first_name;
  };
  get familyMemberLastName(): NonAttribute<string> {
    return this.last_name;
  }
  get familymemberGender(): NonAttribute<number> {
    return this.gender;
  }
  get familyMemberParents(): NonAttribute<string | null> {
    return this.parents;
  };
  get familyMemberEmail(): NonAttribute<string> {
    return this.email;
  };
  get familyMemberMaritalStatus(): NonAttribute<string> {
    return this.marital_status;
  };
  get familyMemberOccupation(): NonAttribute<string | undefined> {
    return this.occupation;
  };
  get familyMemberProfileUrl(): NonAttribute<string | undefined> {
    return this.profile_url;
  };
  get familyMemberCreatedBy(): NonAttribute<number> {
    return this.created_by;
  };
  get familyMemberCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get familyMemberUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }
}

FamilyMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    node_id: { type: DataTypes.STRING },
    tree_ids: { type: DataTypes.JSON },
    // allowNull defaults to true
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    occupation: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.STRING, allowNull: false },
    dod: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    marital_status: { type: DataTypes.STRING, allowNull: false },
    parents: { type: DataTypes.JSON },
    spouses: { type: DataTypes.JSON },
    profile_url: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    children: { type: DataTypes.JSON },
    siblings: { type: DataTypes.JSON },
    created_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
  },
  {
    timestamps: false,
    tableName: 'family_members',
    sequelize: db // passing the `sequelize` instance is required
  }
);

// Define associations
FamilyMember.belongsToMany(FamilyTree, {
  through: 'FamilyTreeMembers',
  foreignKey: 'family_member_id',
  otherKey: 'family_tree_id',
  as: 'FamilyTrees'
});

export default FamilyMember;