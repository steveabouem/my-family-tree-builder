'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTTree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FTTree.hasMany(models.FTFam);
    }
  }
  FTTree.init({
    name: DataTypes.STRING,
    authorized_ips: DataTypes.JSON,
    public: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'FTTree',
  });
  return FTTree;
};