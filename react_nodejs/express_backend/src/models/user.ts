// 'use strict';
// const {
//   Model
// } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       User.belongsToMany(models.Household, { through: 'HouseholdMembers' });
//     }
//   }
//   User.init({
//     email: DataTypes.STRING,
//     first_name: DataTypes.STRING,
//     last_name: DataTypes.STRING,
//     password: {
//       type: DataTypes.STRING,
//       set(value) {
//         this.setDataValue('password', hash(value));
//       }
//     },
//     roles: DataTypes.JSON,
//     tasks: DataTypes.JSON,
//   }, {
//     sequelize,
//     modelName: 'User',
//   });

//   return User;
// };




import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";


// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare email: string;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare roles: number[];
  declare tasks: number[];
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare updated_by: number;
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
  get userId(): NonAttribute<number> {
    return this.id;
  }
  get userEmail(): NonAttribute<string> {
    return this.email;
  }
  get userFirstName(): NonAttribute<string> {
    return this.first_name;
  }
  get userLastName(): NonAttribute<string> {
    return this.last_name;
  }
  get userPassword(): NonAttribute<string> {
    return this.password;
  }
  get userRoles(): NonAttribute<number[]> {
    return this.roles;
  }
  get userTasks(): NonAttribute<number[]> {
    return this.tasks;
  }
  get userCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get userUpdatedBy(): NonAttribute<number> {
    return this.updated_by;
  }
  get userUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  /**
   * End
   * */

  // declare static associations: {
  //   projects: Association<User, User>;
  // };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.STRING,
      defaultValue: new Date().toUTCString()
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roles: {
      type: DataTypes.JSON
    },
    tasks: {
      type: DataTypes.JSON
    },
    updated_at: {
      type: DataTypes.STRING
    },
    updated_by: {
      type: DataTypes.INTEGER
    }

  },
  {
    tableName: 'Users',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default User;