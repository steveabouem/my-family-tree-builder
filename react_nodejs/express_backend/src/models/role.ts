// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Role extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Role.belongsToMany(models.User, { through: 'UserRoles' });
//     }
//   }
//   Role.init({
//     assigned: DataTypes.BOOLEAN,
//     code: DataTypes.STRING, // 3: admin (tracker/FT), 2:user (tracker)
//   }, {
//     sequelize,
//     modelName: 'Role',
//   });
//   return Role;
// };


import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare assigned: boolean;
  declare code: string;
  /**
   * End
   * */


  /**
   * Association Getters/Setters
   * */

  /**
   * End
   * */

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  // declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get roleId(): NonAttribute<number> {
    return this.id;
  }
  get roleCode(): NonAttribute<string> {
    return this.code;
  }
  get roleAssigned(): NonAttribute<boolean> {
    return this.assigned;
  }

  /**
   * End
   * */

  // declare static associations: {
  //   projects: Association<FTIP, FTIP>;
  // };
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    assigned: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Roles',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Role;