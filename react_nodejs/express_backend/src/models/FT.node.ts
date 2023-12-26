import {
  DataTypes, Model, InferAttributes,
  InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";


// ?: a representation of family members reserved for non registered users
class FTNode extends Model<InferAttributes<FTNode>, InferCreationAttributes<FTNode>> {
  declare id: CreationOptional<number>;
  declare ft_id: number; //FTUser.id
  declare first_name: string;
  declare last_name: string;
  declare age: number;
  declare parent_1: number;
  declare parent_2: number;
  declare profile_url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  get FTNodeId(): NonAttribute<number> {
    return this.id;
  }

  get FTNodeFirst_name(): NonAttribute<string> {
    return this.first_name;
  }

  get FTNodeLast_name(): NonAttribute<string> {
    return this.last_name;
  }

  get FTNodeAge(): NonAttribute<number> {
    return this.age;
  }

  get FTNodeParent_1(): NonAttribute<number> {
    return this.parent_1;
  }

  get FTNodeParent_2(): NonAttribute<number> {
    return this.parent_2;
  }

  get FTNodeProfile_url(): NonAttribute<string> {
    return this.profile_url;
  }

  get FTNodeCreatedAt(): NonAttribute<Date> {
    return this.createdAt;
  }

  get FTNodeUpdatedAt(): NonAttribute<Date> {
    return this.updatedAt;
  }
}

FTNode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ft_id: { type: DataTypes.INTEGER, allowNull: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    parent_1: { type: DataTypes.INTEGER, allowNull: false },
    parent_2: { type: DataTypes.INTEGER, allowNull: false },
    profile_url: { type: DataTypes.STRING },
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
    tableName: 'Nodes',
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export default FTNode;