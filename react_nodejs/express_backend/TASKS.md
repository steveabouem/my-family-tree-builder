## Current Task
*FIGURE OUT ASSOCIATIONS GETTERS AND SETTERS*
- Implement FTUser session start (front end)
- Implement FTUser session start (back end??)
- Create FTUser logout route
- Implement FTUser session end

- Create FTFam delete route
- Create FTUser's FTFam index route

- Create attach family to tree logic

- Verify implement session in backend

- Setup swagger

## To test fully
- Create IP checker in service
- Create FTUser create route
- Implement FTuser.create field validations
- Create FTUser login route

- create FTFAM record interface
- create FTFAM service
- Implement FTFAM.create field validations
- Create  FTFam create route
- Create FTFam update route

- create FTTree record interface
- create FTTree service
- Implement FTTree.create field validations
- Create  FTTree create route
- Create FTTree update route

## Ready to deploy 

## Bugs

## Todos (make global search to find file)
- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

- TODO: set user for both below? should this be more ov a service task?

- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

- TODO: CHANGE ALL MODELS TO TS. UNABLE TO USE BUILT IN QUERIES OTHERWISE

- TODO: Objective status will be calculated in the service by the sum of related tasks statuses

- TODO: typing of req body for post requst

- TODO: can i have a way to handle this promise elsewhere, to avoid the then block?

- TODO: can i have a way to handle this promise elsewhere, to avoid the then block?

- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

-  TODO: override Request type with something more precise 
Ideally make a base route handlers class that will accept generics in request 
and return appropriate types...maybe generics as well ?

- TODO: sql select with cursor or resourceLimits. 

- TODO: typing of returned json for line 11 and the result below

- TODO: figure out how to map the generic type's keys to retur an object and use that as return getById and the likes

- TODO: the catch here probably doesnt do the return you think

- TODO: no any

- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

- TODO: figure out how to map the generic type's keys to retur an object and use that as return getById and the likes




- TODO: handle redirect in client

TODO: use ftuser service to match spouse's first and last name and return id here. In the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values

# Question

how can I update the association between my models?
I'm using sequelize and typescript and defined my two models as follow:

import {
  DataTypes, HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationsMixin, Model,
  InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
} from 'sequelize';
import db from "../db";
import FTTree from './ftTree';
import FTUser from './ftUser';


// order of InferAttributes & InferCreationAttributes is important.
class Family extends Model<InferAttributes<Family>, InferCreationAttributes<Family>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
 // ... other attributes
  declare created_by: number; // FTUser
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare getTree: BelongsToGetAssociationMixin<Tree>;
  declare setTree: BelongsToSetAssociationMixin<Tree, number>;
  
  // actively include a relation.
  declare tree?: NonAttribute<Tree>;

  get familyId(): NonAttribute<number> {
    return this.id;
  }
 // ... other getters

  declare static associations: {
    tree: Association<FTFam, FTTree>;
  };
}

FTFam.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true
    },
  // ... other attributes
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'Families',
    sequelize: db
  }
);

FTFam.belongsTo(FTTree, {
  as: 'parent_tree',
  targetKey: 'id',
  foreignKey: 'tree'
});

FTFam.hasMany(FTUser, {
  as: 'users',
  sourceKey: 'id',
  foreignKey: 'members'
});
