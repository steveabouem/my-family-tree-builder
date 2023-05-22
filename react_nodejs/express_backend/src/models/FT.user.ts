import {
  Association, DataTypes, HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationsMixin, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
} from 'sequelize';
import db from "../db";


// order of InferAttributes & InferCreationAttributes is important.
class FTUser extends Model<InferAttributes<FTUser>, InferCreationAttributes<FTUser>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare age: number;
  declare occupation: string;
  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if partner is missing.
  declare partner: ForeignKey<FTUser['id']>;
  declare assigned_ips: string[]; //each FTUser has one or more ip assigned to them. ips can be shared between multiple. model: FTIP"
  declare description: string;
  declare email: string;
  declare gender: number; // 1:m 2:f"
  declare has_ipa: CreationOptional<boolean>; //has authority to update authorized ips"
  declare is_parent: boolean;
  declare imm_family: number; // FTFam: immediate family
  declare marital_status: string;
  declare profile_url: CreationOptional<string>;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // TODO: replace with association
  declare related_to: number[];

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
  get FTUserId(): NonAttribute<number> {
    return this.id;
  }

  get FTUserAge(): NonAttribute<number> {
    return this.age;
  }

  get FTUserEmail(): NonAttribute<string> {
    return this.email;
  }

  get FTUserAssigned_ip(): NonAttribute<string[]> {
    return this.assigned_ips;
  }

  get FTUserDescription(): NonAttribute<string> {
    return this.description;
  }

  get FTUserFirst_name(): NonAttribute<string> {
    return this.first_name;
  }

  get FTUserGender(): NonAttribute<number> {
    return this.gender;
  }

  get FTUserHas_ipa(): NonAttribute<boolean> {
    return this.has_ipa;
  }

  get FTUserIsParent(): NonAttribute<boolean> {
    return this.is_parent;
  }

  get FTUserLastName(): NonAttribute<string> {
    return this.last_name;
  }

  get FTUserImmediateFamily(): NonAttribute<number> {
    return this.imm_family;
  }

  get FTUserMaritalStatus(): NonAttribute<string> {
    return this.marital_status;
  }

  get FTUserOccupation(): NonAttribute<string> {
    return this.occupation;
  }

  get FTUserPartner(): NonAttribute<number> {
    return this.partner;
  }

  get FTUserProfileURL(): NonAttribute<string> {
    return this.profile_url;
  }

  get FTUserPassword(): NonAttribute<string> {
    return this.password;
  }

  get FTUserRelatedTo(): NonAttribute<number[]> {
    return this.related_to;
  }
  // TODO: uncomment once you figure out how to set and fetch associations, 
  // an array of IDs is a little pedestrian. Don't forget the omit param
  // declare static associations: {
  //   families: Association<FTUser, FTFam>;
  // };
}

FTUser.init(
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
      type: DataTypes.BOOLEAN,
    },
    is_parent: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'FTUsers',
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export default FTUser;