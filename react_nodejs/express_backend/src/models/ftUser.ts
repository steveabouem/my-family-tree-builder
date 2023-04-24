'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class FTUser extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) { // define association here
//       FTUser.belongsToMany(models.FTFam, { through: 'FTFamilyMembers' });
//       FTUser.hasOne(models.FTIP);
//     }
//   }
//   FTUser.init({
//     age: DataTypes.INTEGER,
//     assigned_ip: DataTypes.STRING, //each FTUser has an ip assigned to them. ip can be shared between multiple. model: FTIP"
//     description: DataTypes.STRING,
//     first_name: DataTypes.STRING,
//     gender: DataTypes.INTEGER, // 1:m 2:f"
//     has_ipa: DataTypes.BOOLEAN, //has authority to update authorized ips"
//     is_parent: DataTypes.BOOLEAN,
//     last_name: DataTypes.STRING,
//     links_to: DataTypes.INTEGER, // FTFam"
//     marital_status: DataTypes.STRING,
//     occupation: DataTypes.STRING,
//     partner: DataTypes.INTEGER, // FTUser"
//     profile_url: DataTypes.STRING,
//     // password | string
//   }, {
//     sequelize,
//     modelName: 'FTUser',
//   });
//   return FTUser;
// };

import {
  Association, DataTypes, HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationsMixin, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
} from 'sequelize';
import FTFam from './ftFam';
import db from "../db";


// order of InferAttributes & InferCreationAttributes is important.
class FTUser extends Model<InferAttributes<FTUser, { omit: 'families' }>, InferCreationAttributes<FTUser>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare age: number;
  declare occupation: string;
  declare partner: ForeignKey<FTUser['id']>;
  declare assigned_ips: string[]; //each FTUser has one or more ip assigned to them. ips can be shared between multiple. model: FTIP"
  declare description: string;
  declare gender: number; // 1:m 2:f"
  declare has_ipa: CreationOptional<boolean>; //has authority to update authorized ips"
  declare is_parent: boolean;
  declare imm_family: number; // FTFam: immediate family
  declare marital_status: string;
  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if partner is missing.
  declare profile_url: CreationOptional<string>;
  declare password: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // FTFAM
  declare getFamilies: HasManyGetAssociationsMixin<FTFam>; // Note the null assertions!
  declare setFamilies: HasManySetAssociationsMixin<FTFam, number>;
  declare addFamilies: HasManyAddAssociationsMixin<FTFam, number>;
  declare removeFamilies: HasManyRemoveAssociationsMixin<FTFam, number>;
  declare hasFamilies: HasManyHasAssociationsMixin<FTFam, number>;
  declare countFamilies: HasManyCountAssociationsMixin;

  // FTIP
  // declare getIP: HasManyGetAssociationsMixin<FTIP>; // Note the null assertions!
  // declare setIP: HasManySetAssociationsMixin<FTIP, string[]>;
  // declare addIP: HasManyAddAssociationsMixin<FTIP, string[]>;
  // declare removeIP: HasManyRemoveAssociationsMixin<FTIP, string[]>;
  // declare hasIP: HasManyHasAssociationsMixin<FTIP, string[]>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare families?: NonAttribute<FTFam[]>; // Note this is optional since it's only populated when explicitly requested in code
  // declare ip?: NonAttribute<FTIP[]>; // Note this is optional since it's only populated when explicitly requested in code

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FTUserId(): NonAttribute<number> {
    return this.id;
  }

  get FTUserAge(): NonAttribute<number> {
    return this.age;
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

  get FTUserCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }

  get FTUserUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  declare static associations: {
    families: Association<FTUser, FTFam>;
  };
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
      allowNull: true,
    },
    is_parent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
      allowNull: false,
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'FTUsers',
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export default FTUser;