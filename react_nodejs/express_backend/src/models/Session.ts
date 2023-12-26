import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare key: string; // token
  declare user_id: number; 
  declare time: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  get SessionId(): NonAttribute<number> {
    return this.id;
  }
  get SessionKey(): NonAttribute<string> {
    return this.key;
  }
  get SessionCreatedAt(): NonAttribute<Date> {
    return this.createdAt;
  }
  get SessionUpdatedAt(): NonAttribute<Date> {
    return this.updatedAt;
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    key: { type: DataTypes.STRING }, // json stringify of entire session object
    user_id: { type: DataTypes.INTEGER },
    time: { type: DataTypes.DATE },
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
    tableName: 'Sessions',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Session;