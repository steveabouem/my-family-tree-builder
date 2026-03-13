// models/Invite.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from "../../db";
import {FamilyTree, User} from './';

class Invite extends Model<
  InferAttributes<Invite>,
  InferCreationAttributes<Invite>
> {
  declare id: CreationOptional<number>;
  declare tree_id: ForeignKey<FamilyTree['id']>;
  declare email: string;
  declare invited_by_user_id: ForeignKey<User['id']>;
  declare token: string;
  declare status: 'pending' | 'accepted' | 'revoked' | 'expired';
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Invite.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    tree_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    invited_by_user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'revoked', 'expired'),
      allowNull: false,
      defaultValue: 'pending',
    },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize, tableName: 'invites', timestamps: true }
);

export default Invite;