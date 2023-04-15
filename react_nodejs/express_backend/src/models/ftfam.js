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
      FTFam.belongsToMany(models.FTUser, { through: 'FTFamilyMembers' });
      FTFam.belongsTo(models.FTTree)
    }
  }
  FTFam.init({
    base_location: DataTypes.INTEGER, // FTLoc
    description: DataTypes.STRING,
    head_1: DataTypes.INTEGER, // FTUser
    head_count: DataTypes.INTEGER,
    linked_fams: DataTypes.JSON, // FTFam
    name: DataTypes.STRING,
    profile_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'FTFam',
  });
  return FTFam;
};