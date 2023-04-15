'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTLoc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FTLoc.init({
    coords: DataTypes.STRING,
    name: DataTypes.STRING,
    flag_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FTLoc',
  });
  return FTLoc;
};