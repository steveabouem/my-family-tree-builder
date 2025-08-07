import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from "../../db";

// order of InferAttributes & InferCreationAttributes is important.
class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
  declare id: CreationOptional<string>;
  declare data: number;
  declare stale_time: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Session.init(
  {
    id: {
      type: DataTypes.STRING(),
      autoIncrement: true,
      primaryKey: true
    },
    stale_time: { type: DataTypes.BIGINT, allowNull: false },
    data: { type: DataTypes.JSON },
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
    tableName: 'Sessions', // using the default session table. 
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Session;