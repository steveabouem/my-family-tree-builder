import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class FTSession extends Model<InferAttributes<FTSession>, InferCreationAttributes<FTSession>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare key: string; // token
  declare user_id: number; 
  declare time: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  get FTSessionId(): NonAttribute<number> {
    return this.id;
  }
  get FTSessionKey(): NonAttribute<string> {
    return this.key;
  }
  get FTSessionCreatedAt(): NonAttribute<Date> {
    return this.createdAt;
  }
  get FTSessionUpdatedAt(): NonAttribute<Date> {
    return this.updatedAt;
  }
}

FTSession.init(
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
    tableName: 'FTSessions',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default FTSession;