"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// order of InferAttributes & InferCreationAttributes is important.
class FTLoc extends sequelize_1.Model {
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
exports.default = FTLoc;
