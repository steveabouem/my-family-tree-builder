// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class FTTree extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       // FTTree.hasMany(models.FTFam);
//     }
//   }
//   FTTree.init({
//     authorized_ips: DataTypes.JSON,
//     public: DataTypes.BOOLEAN,
//     name: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'FTTree',
//   });
//   return FTTree;
// };



import {
  Association, DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute, HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyRemoveAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';
import db from "../db";
import FTFam from './ftFam';


// order of InferAttributes & InferCreationAttributes is important.
class FTTree extends Model<InferAttributes<FTTree, { omit: 'families' }>, InferCreationAttributes<FTTree>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare authorized_ips: string[];
  declare public: boolean;
  declare name: string;
  declare active: boolean;
  declare created_by: number; //FTUser
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  /**
   * End
   * */


  /**
   * Association Getters/Setters
   * */
  // FTFAM
  declare getFamilies: HasManyGetAssociationsMixin<FTFam>; // Note the null assertions!
  declare setFamilies: HasManySetAssociationsMixin<FTFam, number>;
  declare addFamilies: HasManyAddAssociationsMixin<FTFam, number>;
  declare removeFamilies: HasManyRemoveAssociationsMixin<FTFam, number>;
  declare hasFamilies: HasManyHasAssociationsMixin<FTFam, number>;
  declare countFamilies: HasManyCountAssociationsMixin;
  /**
   * End
   * */

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare families?: NonAttribute<FTFam[]>; // Note this is optional since it's only populated when explicitly requested in code

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FTTreeId(): NonAttribute<number> {
    return this.id;
  }
  get FTTreeAuthorized_ips(): NonAttribute<string[]> {
    return this.authorized_ips;
  };
  get FTTreePublic(): NonAttribute<boolean> {
    return this.public;
  };
  get FTTreeName(): NonAttribute<string> {
    return this.name;
  };
  get FTTreeCreated_by(): NonAttribute<number> { //FTUser
    return this.created_by;
  }
  get FTTreeActive(): NonAttribute<boolean> {
    return this.active;
  }
  get FTTreeCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get FTTreeUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  /**
   * End
   * */

  declare static associations: {
    families: Association<FTTree, FTFam>;
  };
}

FTTree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authorized_ips: {
      type: DataTypes.JSON
    },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: new Date().toUTCString
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    tableName: 'FTTrees',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default FTTree;