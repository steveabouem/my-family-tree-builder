'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Objective extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Objective.belongsTo(models.Household);
      Objective.hasMany(models.Task);
    }
  }
  Objective.init({
    name: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    description: DataTypes.STRING,
    expenses: DataTypes.INTEGER,
    budget: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Objective',
  });
  return Objective;
};