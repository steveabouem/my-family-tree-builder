import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
} from 'sequelize';
import db from "../db";


// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare age: number;
  declare parent_1: number | null;
  declare parent_2: number | null;
  declare occupation: string;
  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if partner is missing.
  declare partner: ForeignKey<User['id']>;
  declare assigned_ips: string[]; //each User has one or more ip assigned to them. ips can be shared between multiple. model: FTIP"
  declare description: string;
  declare email: string;
  declare gender: number; // 1:m 2:f"
  declare has_ipa: CreationOptional<number>; //has authority to update authorized ips"
  declare is_parent: number; // 1/0
  declare imm_family: number; // Family: immediate family
  declare marital_status: string;
  declare profile_url: CreationOptional<string>;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare related_to: number[];

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get userId(): NonAttribute<number> {
    return this.id;
  }

  get userAge(): NonAttribute<number> {
    return this.age;
  }
  get userParent_1(): NonAttribute<number> {
    return this.age;
  }
  get userParent_2(): NonAttribute<number> {
    return this.age;
  }

  get userEmail(): NonAttribute<string> {
    return this.email;
  }

  get userAssigned_ip(): NonAttribute<string[]> {
    return this.assigned_ips;
  }

  get userDescription(): NonAttribute<string> {
    return this.description;
  }

  get userFirst_name(): NonAttribute<string> {
    return this.first_name;
  }

  get userGender(): NonAttribute<number> {
    return this.gender;
  }

  get userHas_ipa(): NonAttribute<number> {
    return this.has_ipa;
  }

  get userIsParent(): NonAttribute<number> {
    return this.is_parent;
  }

  get userLastName(): NonAttribute<string> {
    return this.last_name;
  }

  get UserImmediateFamily(): NonAttribute<number> {
    return this.imm_family;
  }

  get UserMaritalStatus(): NonAttribute<string> {
    return this.marital_status;
  }

  get UserOccupation(): NonAttribute<string> {
    return this.occupation;
  }

  get UserPartner(): NonAttribute<number> {
    return this.partner;
  }

  get UserProfileURL(): NonAttribute<string> {
    return this.profile_url;
  }

  get UserPassword(): NonAttribute<string> {
    return this.password;
  }

  get UserRelatedTo(): NonAttribute<number[]> {
    return this.related_to;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_ips: {
      type: DataTypes.JSON,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    has_ipa: {
      type: DataTypes.INTEGER,
    },
    parent_1: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, is_parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imm_family: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    marital_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    partner: {
      type: DataTypes.INTEGER,
    },
    profile_url: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    related_to: {
      type: DataTypes.JSON
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export default User;