'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Household, { through: 'HouseholdMembers' });
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', hash(value));
      }
    },
    tasks: DataTypes.JSON,
    roles: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
