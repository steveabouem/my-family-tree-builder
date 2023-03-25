'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FTPer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FTPer.belongsToMany(models.FTFam, { through: 'FTFamilyMembers' });
    }
  }
  FTPer.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    occupation: DataTypes.STRING,
    partner: DataTypes.INTEGER, // FTPer
    marital_status: DataTypes.STRING,
    is_parent: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    gender: DataTypes.INTEGER, // 1:m 2:f
    profile_url: DataTypes.STRING,
    description: DataTypes.STRING,
    assigned_ip: DataTypes.STRING, //each FTPer has an ip assigned to them. ip can be shared between multiple
    has_ipa: DataTypes.BOOLEAN, //has authority to update authorized ips
    links_to: DataTypes.INTEGER // FTFam
  }, {
    sequelize,
    modelName: 'FTPer',
  });
  return FTPer;
};