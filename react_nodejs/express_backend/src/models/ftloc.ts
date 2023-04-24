// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class FTLoc extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   FTLoc.init({
//     coords: DataTypes.STRING,
//     name: DataTypes.STRING,
//     flag_url: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'FTLoc',
//   });
//   return FTLoc;
// };


import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';


// order of InferAttributes & InferCreationAttributes is important.
class FTLoc extends Model<InferAttributes<FTLoc>, InferCreationAttributes<FTLoc>> { // this can be replaced by a location api (google for instance)
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare value: string;
  /**
   * End
   * */


  /**
   * Association Getters/Setters
   * */

  /**
   * End
   * */

}

// FTLoc.init(
//   {
//     id: {
//       type: DataTypes.INTEGER(),
//       autoIncrement: true,
//       primaryKey: true
//     },
//     value: { type: DataTypes.STRING },
//   },
//   {
//     tableName: 'FTLoc',
//     sequelize: db // passing the `sequelize` instance is required
//   }
// );

export default FTLoc;