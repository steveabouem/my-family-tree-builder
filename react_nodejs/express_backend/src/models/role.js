'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User, { through: 'UserRoles' })
    }
  }
  Role.init({
    assigned: DataTypes.BOOLEAN,
    code: DataTypes.STRING, // 3: admin (tracker/FT), 2:user (tracker)
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};