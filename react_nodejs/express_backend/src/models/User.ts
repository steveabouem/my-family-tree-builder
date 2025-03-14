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
  declare age: number | null;
  declare dob: string;
  declare role_id: number;
  declare occupation: string;
  declare assigned_ips: string[]; //each User has one or more ip assigned to them. ips can be shared between multiple. model: FTIP"
  declare description: string;
  declare email: string;
  declare gender: number; // 1:m 2:f"
  declare has_ipa: CreationOptional<number>; //has authority to update authorized ips"
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

  get userAge(): NonAttribute<number | null> {
    return this.age;
  }
  get userDOB(): NonAttribute<string> {
    return this.dob;
  }
  get userParent_1(): NonAttribute<number | null> {
    return this.role_id;
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

  get userLastName(): NonAttribute<string> {
    return this.last_name;
  }

  get UserOccupation(): NonAttribute<string> {
    return this.occupation;
  }

  get UserProfileURL(): NonAttribute<string> {
    return this.profile_url;
  }

  get UserPassword(): NonAttribute<string> {
    return this.password;
  }

  get UserRole(): NonAttribute<number> {
    return this.role_id;
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
      allowNull: true,
    },
    dob: {
      type: DataTypes.STRING,
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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