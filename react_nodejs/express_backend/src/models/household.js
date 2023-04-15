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
    budget: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    description: DataTypes.STRING,
    expenses: DataTypes.INTEGER,
    head_1: DataTypes.INTEGER, //User
    head_2: DataTypes.INTEGER, //User
    name: DataTypes.STRING,
    profile_url: DataTypes.STRING,
    updated_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Household',
  });
  return Household;
};