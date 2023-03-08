'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FTper.belongsToMany(models.FTFam, { through: 'FTFamilyMembers' });
    }
  }
  FTper.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    occupation: DataTypes.STRING,
    partner: DataTypes.INTEGER, // ftpers
    marital_status: DataTypes.STRING,
    is_co_head: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    profile_url: DataTypes.STRING,
    description: DataTypes.STRING,
    links_to: DataTypes.INTEGER // FTFam
  }, {
    sequelize,
    modelName: 'FTper',
  });
  return FTper;
};