import {
  DataTypes, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationsMixin, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute, Association,
} from 'sequelize';
import db from "../db";
import FTUser from './FT.user';


// order of InferAttributes & InferCreationAttributes is important.
class FTFam extends Model<InferAttributes<FTFam>, InferCreationAttributes<FTFam>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare base_location: string; // FTLoc
  declare description: string;
  declare head_1: number; // FTUser
  declare head_2: number; // ?FTUser
  declare head_count: number;
  declare tree: number; // FTTree
  declare name: string;
  declare profile_url: string;
  declare created_by: number; // FTUser
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // TODO: replace with association
  declare members: number[];

  // FTUser
  // declare getMembers: HasManyGetAssociationsMixin<FTUser>; // Note the null assertions!
  // declare setMembers: HasManySetAssociationsMixin<FTUser, number>;
  // declare addMembers: HasManyAddAssociationsMixin<FTUser, number>;
  // declare removeMembers: HasManyRemoveAssociationsMixin<FTUser, number>;
  // declare hasMembers: HasManyHasAssociationsMixin<FTUser, number>;
  // declare countMembers: HasManyCountAssociationsMixin;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  // declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get FTFamId(): NonAttribute<number> {
    return this.id;
  }
  get FTFamBaseLocation(): NonAttribute<string> {
    return this.base_location;
  }
  get FTFamDescription(): NonAttribute<string> {
    return this.description;
  }
  get FTFamHead1(): NonAttribute<number> {
    return this.head_1;
  }
  get FTFamHead2(): NonAttribute<number> {
    return this.head_2;
  }
  get FTFamHeadCount(): NonAttribute<number> {
    return this.head_count;
  }
  get FTFamTree(): NonAttribute<number> {
    return this.tree;
  }
  get FTFamName(): NonAttribute<string> {
    return this.name;
  }
  get FTFamProfileURL(): NonAttribute<string> {
    return this.profile_url;
  }
  get FTFamCreatedBy(): NonAttribute<number> {
    return this.created_by;
  }
  get FTFamCreatedAt(): NonAttribute<Date> {
    return this.created_at;
  }
  get FTFamUpdatedAt(): NonAttribute<Date> {
    return this.updated_at;
  }

  get FTFamMembers(): NonAttribute<number[]> {
    return this.members;
  }

  // TODO: uncomment once you figure out how to set and fetch associations, 
  // an array of IDs is a little pedestrian. Don't forget the omit param
  // declare static associations: {
  //   members: Association<FTFam, FTUser>;
  // };
}

FTFam.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
    base_location: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    head_1: { type: DataTypes.INTEGER, allowNull: false },
    head_2: { type: DataTypes.INTEGER },
    head_count: { type: DataTypes.INTEGER },
    tree: { type: DataTypes.INTEGER },
    profile_url: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    members: {
      type: DataTypes.JSON
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updated_at: {
      type: DataTypes.DATE,
    }
  },
  {
    tableName: 'FTFams',
    sequelize: db // passing the `sequelize` instance is required
  }
);

// FTFam.hasMany(FTUser, {
//   as: 'users',
//   foreignKey: 'members'
// });

export default FTFam;