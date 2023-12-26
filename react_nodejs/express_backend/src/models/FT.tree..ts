import {
  Association, DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute, HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin, HasManyRemoveAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';
import db from "../db";

// order of InferAttributes & InferCreationAttributes is important.
class Tree extends Model<InferAttributes<Tree>, InferCreationAttributes<Tree>> {
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
  declare created_by: number; //FTUser
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // TODO: replace with association
  declare families: string;
  /**
   * End
   * */


  /**
   * Association Getters/Setters
   * */
  // FAMILY 
  // declare getFamilies: HasManyGetAssociationsMixin<Family>; // Note the null assertions!
  // declare setFamilies: HasManySetAssociationsMixin<Family, number>;
  // declare addFamilies: HasManyAddAssociationsMixin<Family, number>;
  // declare removeFamilies: HasManyRemoveAssociationsMixin<Family, number>;
  // declare hasFamilies: HasManyHasAssociationsMixin<Family, number>;
  // declare countFamilies: HasManyCountAssociationsMixin;
  /**
   * End
   * */

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  // declare families?: NonAttribute<Family[]>; // Note this is optional since it's only populated when explicitly requested in code

  /**
   * Attributes Getters/Setters
   * */
  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get treeId(): NonAttribute<number> {
    return this.id;
  }
  get treeAuthorized_ips(): NonAttribute<string> {
    return this.authorized_ips;
  };
  get treePublic(): NonAttribute<number> {
    return this.public;
  };
  get treeName(): NonAttribute<string> {
    return this.name;
  };
  get treeCreated_by(): NonAttribute<number> { //FTUser
    return this.created_by;
  }
  get treeActive(): NonAttribute<number> {
    return this.active;
  }
  get treeCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get treeUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  get treeFAmilies(): NonAttribute<string> {
    return this.families;
  };

  // TODO: uncomment once you figure out how to set and fetch associations, 
  // an array of IDs is a little pedestrian. Don't forget the omit param
  // public getFams(): Family[] | undefined {
  //   return this.families;
  // }
  /**
   * End
   * */

  // declare static associations: {
  //   families: Association<FTTree, Family>;
  // };
}

Tree.init(
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
    families: {
      type: DataTypes.JSON,
      defaultValue: '[]'
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
    tableName: 'Trees',
    sequelize: db // passing the `sequelize` instance is required
  }
);

export default Tree;