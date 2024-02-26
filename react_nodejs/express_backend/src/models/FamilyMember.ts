import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class FamilyMember extends Model<InferAttributes<FamilyMember>, InferCreationAttributes<FamilyMember>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare age: number;
  declare description: string;
  declare first_name: string;
  declare gender: number; //1:M, 2:F
  declare parent_1: number;
  declare parent_2: number;
  declare email: string;
  declare last_name: string;
  declare imm_family: number;
  declare marital_status: string;
  declare occupation: string;
  declare partner: number;
  declare profile_url: string;
  declare created_by: number; //User
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  /**
   *  Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FamilyMemberId(): NonAttribute<number> {
    return this.id;
  }
  get familyMemberAge(): NonAttribute<number> {
    return this.age;
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
  get familyMemberParent1(): NonAttribute<number> {
    return this.parent_1;
  };
  get familyMemberParent2(): NonAttribute<number> {
    return this.parent_2;
  };
  get familyMemberEmail(): NonAttribute<string> {
    return this.email;
  };
  get familyMemberImmFamily(): NonAttribute<number> {
    return this.imm_family;
  };
  get familyMemberMaritalStatus(): NonAttribute<string> {
    return this.marital_status;
  };
  get familyMemberOccupation(): NonAttribute<string> {
    return this.occupation;
  };
  get familyMemberPartner(): NonAttribute<number> {
    return this.partner;
  };
  get familyMemberProfileUrl(): NonAttribute<string> {
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
    age: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING },
    gender: { type: DataTypes.INTEGER },
    parent_1: { type: DataTypes.INTEGER },
    parent_2: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    imm_family: { type: DataTypes.INTEGER },
    marital_status: { type: DataTypes.STRING },
    occupation: { type: DataTypes.STRING },
    partner: { type: DataTypes.INTEGER },
    profile_url: { type: DataTypes.STRING },
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

export default FamilyMember;