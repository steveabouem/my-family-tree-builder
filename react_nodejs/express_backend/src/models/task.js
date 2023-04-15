'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Task.belongsTo(models.Objective);
        }
    }
    Task.init({
        assignees: DataTypes.JSON, //User[]
        cost: DataTypes.INTEGER,
        created_by: DataTypes.INTEGER,
        description: DataTypes.STRING,
        lead: DataTypes.INTEGER //User
    }, {
        sequelize,
        modelName: 'Task',
    });
    return Task;
};