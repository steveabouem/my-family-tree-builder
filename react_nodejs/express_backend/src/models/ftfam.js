'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTFam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FTFam.belongsToMany(models.FTPer, { through: 'FTFamilyMembers' });
      FTFam.belongsTo(models.FTTree)
    }
  }
  FTFam.init({
    name: DataTypes.STRING,
    head_count: DataTypes.INTEGER,
    profile_url: DataTypes.STRING,
    linked_fams: DataTypes.JSON, // FTFam
    description: DataTypes.STRING,
    base_location: DataTypes.INTEGER, // FTLoc
    head_1: DataTypes.INTEGER, // FTPer
  }, {
    sequelize,
    modelName: 'FTFam',
  });
  return FTFam;
};
// 514 845 8338