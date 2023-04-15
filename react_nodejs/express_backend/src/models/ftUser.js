'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // define association here FTUser.belongsToMany(models.FTFam, { through: 'FTFamilyMembers' });
    }
  }
  FTUser.init({
    age: DataTypes.INTEGER,
    assigned_ip: DataTypes.STRING, //each FTUser has an ip assigned to them. ip can be shared between multiple"
    description: DataTypes.STRING,
    first_name: DataTypes.STRING,
    gender: DataTypes.INTEGER, // 1:m 2:f"
    has_ipa: DataTypes.BOOLEAN, //has authority to update authorized ips"
    is_parent: DataTypes.BOOLEAN,
    last_name: DataTypes.STRING,
    links_to: DataTypes.INTEGER, // FTFam"
    marital_status: DataTypes.STRING,
    occupation: DataTypes.STRING,
    partner: DataTypes.INTEGER, // FTUser"
    profile_url: DataTypes.STRING,
    // password | string
  }, {
    sequelize,
    modelName: 'FTUser',
  });
  return FTUser;
};