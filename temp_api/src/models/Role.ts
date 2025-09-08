import { CreationOptional, DataTypes, InferAttributes, Model, NonAttribute } from "sequelize";

import db from "../../db";

class Role extends Model<InferAttributes<Role>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare permissions: string; // Permission.id[]

  get roleId(): NonAttribute<number> {
    return this.id;
  }
  get roleName(): NonAttribute<string> {
    return this.name;
  }
  get rolePermissions(): NonAttribute<string> {
    return this.permissions;
  }
}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON
  }
},
{
  timestamps: false,
  tableName: 'roles',
  sequelize: db // passing the `sequelize` instance is required
});
export default Role;