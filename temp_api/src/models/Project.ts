import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';

import db from "../../db";

interface Expense {
  name: string;
  description: string;
  date: Date;
  deadline: Date;
}

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare goal: string;
  declare budget: number;
  declare expenses: Expense[];
  declare projectLead: number;
  declare teams: number[];
  declare status: number; // 1-5
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    expenses: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    projectLead: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teams: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: 'projects',
    sequelize: db,
  }
);

export default Project; 