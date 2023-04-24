// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class FTFam extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       FTFam.belongsToMany(models.FTUser, { through: 'FTFamilyMembers' });
//       FTFam.belongsTo(models.FTTree);
//     }
//   }
//   FTFam.init({
//     base_location: DataTypes.INTEGER, // location api
//     description: DataTypes.STRING,
//     head_1: DataTypes.INTEGER, // FTUser
//     head_count: DataTypes.INTEGER,
//     linked_fams: DataTypes.JSON, // FTFam
//     name: DataTypes.STRING,
//     profile_url: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'FTFam',
//   });
//   return FTFam;
// };


import {
  DataTypes, HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationsMixin, Model,
  InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";
import FTUser from './ftUser';


// order of InferAttributes & InferCreationAttributes is important.
class FTFam extends Model<InferAttributes<FTFam>, InferCreationAttributes<FTFam>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare base_location: number; // FTLoc
  declare description: string;
  declare head_1: number; // FTUser
  declare head_2: number; // ?FTUser
  declare head_count: number;
  declare linked_fams: number[]; // FTFam
  declare name: string;
  declare profile_url: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // FTUser
  declare getMembers: HasManyGetAssociationsMixin<FTUser>; // Note the null assertions!
  declare setMembers: HasManySetAssociationsMixin<FTUser, number>;
  declare addMembers: HasManyAddAssociationsMixin<FTUser, number>;
  declare removeMembers: HasManyRemoveAssociationsMixin<FTUser, number>;
  declare hasMembers: HasManyHasAssociationsMixin<FTUser, number>;
  declare countMembers: HasManyCountAssociationsMixin;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FTFamId(): NonAttribute<number> {
    return this.id;
  }
  get FTFamBaseLocation(): NonAttribute<number> {
    return this.base_location;
  }
  get FTFamDescription(): NonAttribute<string> {
    return this.description;
  }
  get FTFamHead1(): NonAttribute<number> {
    return this.head_1;
  }
  get FTFamHead2(): NonAttribute<number> {
    return this.head_2;
  }
  get FTFamHeadCount(): NonAttribute<number> {
    return this.head_count;
  }
  get FTFamLinkedFams(): NonAttribute<number[]> {
    return this.linked_fams;
  }
  get FTFamName(): NonAttribute<string> {
    return this.name;
  }
  get FTFamProfileURL(): NonAttribute<string> {
    return this.profile_url;
  }
  get FTFamCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get FTFamUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }
}

FTFam.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    base_location: { type: DataTypes.INTEGER },
    description: { type: DataTypes.STRING },
    head_1: { type: DataTypes.INTEGER },
    head_2: { type: DataTypes.INTEGER },
    head_count: { type: DataTypes.INTEGER },
    linked_fams: { type: DataTypes.JSON },
    profile_url: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    created_at: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: new Date().toUTCString()
    },
    updated_at: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'FTFams',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default FTFam;