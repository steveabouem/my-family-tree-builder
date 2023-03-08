'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Household.belongsToMany(models.User, { through: 'HouseholdMembers' });
      Household.hasMany(models.Objective);
    }
  }
  Household.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    expenses: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    budget: DataTypes.INTEGER,
    profile_url: DataTypes.STRING,
    head_1: DataTypes.INTEGER, //User
    head_2: DataTypes.INTEGER //User
  }, {
    sequelize,
    modelName: 'Household',
  });
  return Household;
};