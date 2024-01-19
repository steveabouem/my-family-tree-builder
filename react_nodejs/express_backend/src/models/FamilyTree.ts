import {
  DataTypes, Model, InferAttributes, InferCreationAttributes,CreationOptional, NonAttribute
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class FamilyTree extends Model<InferAttributes<FamilyTree>, InferCreationAttributes<FamilyTree>> {
  /**
   * Attributes
   * */
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare authorized_ips: string;
  declare public: number;
  declare name: string;
  declare active: number;
  declare created_by: number; //User
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FamilytreeId(): NonAttribute<number> {
    return this.id;
  }
  get familyTreeAuthorized_ips(): NonAttribute<string> {
    return this.authorized_ips;
  };
  get familyTreePublic(): NonAttribute<number> {
    return this.public;
  };
  get familyTreeName(): NonAttribute<string> {
    return this.name;
  };
  get familyTreeCreated_by(): NonAttribute<number> { //User
    return this.created_by;
  }
  get familytreeActive(): NonAttribute<number> {
    return this.active;
  }
  get familyTreeCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get familyTreeUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }
}

FamilyTree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authorized_ips: {
      type: DataTypes.JSON
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    public: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'family_trees',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default FamilyTree;