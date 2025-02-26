import { CreationOptional, DataTypes, InferAttributes, Model, NonAttribute } from "sequelize";
import db from "../db";

class Permission extends Model<InferAttributes<Permission>> {
  declare id: CreationOptional<number>;
  declare name: string;

  get permissionId(): NonAttribute<number> {
    return this.id;
  }
  get permissionName(): NonAttribute<string> {
    return this.name;
  }
}

Permission.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  timestamps: false,
  tableName: 'permissions',
  sequelize: db
});