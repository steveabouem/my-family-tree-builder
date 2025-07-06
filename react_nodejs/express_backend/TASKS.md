## Current Task
<!-- ! PRIORITY the session is still not good: current user is not accessible in view tree endpoint for instance. ! -->
- update canviewTree function to sue session user
- style the tree
- Create Family delete route

- Create attach family to tree logic

- Setup swagger

## To test fully
- when creating the tree, to match the RFT library update as follows (record created => target to update in RFT hashmap given what is available overall at the moment of creation of current record):
  - C̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶ f̶a̶m̶i̶l̶y̶ m̶e̶m̶b̶e̶r̶ =̶>̶ s̶e̶l̶f̶

  - Mother => 
    -̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶.̶p̶a̶r̶e̶n̶t̶s̶ a̶r̶r̶a̶y̶ =̶>̶ s̶e̶l̶f̶
    -̶ s̶e̶l̶f̶ c̶h̶i̶l̶d̶r̶e̶n̶ =̶>̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶

  - Father => 
    -̶ m̶o̶t̶h̶e̶r̶.̶s̶p̶o̶u̶s̶e̶s̶ a̶r̶r̶a̶y̶ w̶i̶t̶h̶ s̶e̶l̶f̶
    -̶ s̶e̶l̶f̶.̶s̶p̶o̶u̶s̶e̶s̶ a̶r̶r̶a̶y̶ w̶i̶t̶h̶ m̶o̶t̶h̶e̶r̶
    -̶ s̶e̶l̶f̶.̶c̶h̶i̶l̶d̶r̶e̶n̶ =̶>̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶

  - Spouse => 
    -̶ s̶e̶l̶f̶.̶s̶p̶o̶u̶s̶e̶s̶ =̶>̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶
    -̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶.̶s̶p̶o̶u̶s̶e̶s̶ =̶>̶ s̶e̶l̶f̶


  - Siblings =>
    -̶ b̶u̶l̶k̶ c̶r̶e̶a̶t̶e̶,̶ t̶h̶e̶n̶ m̶a̶p̶ a̶n̶d̶ a̶d̶d̶ e̶a̶c̶h̶ n̶e̶w̶ r̶e̶c̶o̶r̶d̶ t̶o̶ h̶a̶s̶m̶a̶p̶ 
    -̶ e̶a̶c̶h̶ s̶e̶l̶f̶.̶s̶i̶b̶l̶i̶n̶g̶s̶ a̶r̶r̶a̶y̶ =̶>̶ l̶i̶s̶t̶,̶ m̶i̶n̶u̶s̶ c̶u̶r̶r̶e̶n̶t̶ i̶n̶d̶e̶x̶ +̶ c̶u̶r̶r̶e̶n̶t̶ u̶s̶e̶r̶
    -̶ e̶a̶c̶h̶ s̶e̶l̶f̶.̶p̶a̶r̶e̶n̶t̶s̶ a̶r̶r̶a̶y̶ =̶>̶ a̶l̶l̶ p̶a̶r̶e̶n̶t̶s̶ c̶r̶e̶a̶t̶e̶d̶ s̶o̶ f̶a̶r̶e̶ (̶1̶ o̶r̶ 2̶)̶


  - Children =>
    -̶ b̶u̶l̶k̶ c̶r̶e̶a̶t̶e̶,̶ t̶h̶e̶n̶ m̶a̶p̶ a̶n̶d̶ a̶d̶d̶ e̶a̶c̶h̶ n̶e̶w̶ r̶e̶c̶o̶r̶d̶ t̶o̶ h̶a̶s̶m̶a̶p̶ 
    -̶ e̶a̶c̶h̶ s̶e̶l̶f̶.̶p̶a̶r̶e̶n̶t̶s̶ a̶r̶r̶a̶y̶ =̶>̶ a̶l̶l̶ p̶a̶r̶e̶n̶t̶s̶ c̶r̶e̶a̶t̶e̶d̶ s̶o̶ f̶a̶r̶ (̶1̶ o̶r̶ 2̶)̶e̶a̶c̶h̶ -̶ - e̶a̶c̶h̶ s̶e̶l̶f̶.̶s̶i̶b̶l̶i̶n̶g̶s̶ a̶r̶r̶a̶y̶ =̶>̶ l̶i̶s̶t̶,̶ m̶i̶n̶u̶s̶ c̶u̶r̶r̶e̶n̶t̶ i̶n̶d̶e̶x̶
- Create User's Family index route
- Implement User session end
- Create User logout route
- Implement User session start (front end)
- Implement User session start (back end??)
- Verify implement session in backend
- Create IP checker in middleware
- Create User create route
- Implement User.create field validations
- Create User login route

- create FAMILY record interface
- create FAMILY middleware
- Implement FAMILY.create field validations
- Create  Family create route
- Create Family update route

- create FTTree record interface
- create FTTree middleware
- Implement FTTree.create field validations
- Create  FTTree create route
- Create FTTree update route

## Ready to deploy 

## Bugs

## Todos (make global search to find file)
- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

- TODO: set user for both below? should this be more ov a middleware task?

- TODO: catch return false doesnt actually catch falty logic, 
just wrong syntax and maybe wrong typing. FIX

- TODO: CHANGE ALL MODELS TO TS. UNABLE TO USE BUILT IN QUERIES OTHERWISE

- TODO: Objective status will be calculated in the middleware by the sum of related tasks statuses

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

TODO: use user middleware to match spouse's first and last name and return id here. In the front, it will be some sort of dd that will use the MiddlewareWorker, and add the id to the form values

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
import User from './user';


// order of InferAttributes & InferCreationAttributes is important.
class Family extends Model<InferAttributes<Family>, InferCreationAttributes<Family>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
 // ... other attributes
  declare created_by: number; // User
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
    tree: Association<Family, FTTree>;
  };
}

Family.init(
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

Family.belongsTo(FTTree, {
  as: 'parent_tree',
  targetKey: 'id',
  foreignKey: 'tree'
});

Family.hasMany(User, {
  as: 'users',
  sourceKey: 'id',
  foreignKey: 'members'
});


THEME: 
- four seasons since weère talking about a tree. Even when the app will expand to more than that it will still be relevant
- Spring theme (green) alternative: https://dribbble.com/shots/25813846-Flos-Alternative-Medicine-Holistic-Health-Elementor-Template
- Summer them
- Fall theme (brown) https://dribbble.com/shots/25876138-Gourmet-Resto-A-Cinematic-Odoo-Theme-for-Elegant-Dining-Brands
- Winter theme (whiteégrey) https://dribbble.com/shots/25983784-Yacht-and-Boat-Storage-Service-Landing-page

# Bug on tree update
- Need to reset the form values and totalSteps when  tree is generated.
- once thre tree is created , it should be redirected to the trees page
[x] can create a tree with one anchor
[x] can create a tree with one anchor amd father/mother
[x] can create a tree with one anchor amd sister/brother
[x] can create a tree with one anchor amd son/daughter
[x] can create a tree with one anchor one of each nuclear family member 
[x] after confirming the addition of one family member we can move back and forth and the correct values are displayed
[x] after confirming the addition of multiple family members we can move back and forth and the correct values are displayed
[x] can create a tree with one anchor and multiple father/mother 
[x] can create a tree with one anchor and multiple sister/brother (works, but alignment fails)
[x] can create a tree with one anchor and multiple son/daughter
[x] can create a tree with one anchor and one of each nuclear family member 
[x] can create a tree with one anchor and multiple of each nuclear family member 
[] *is assigning node area width based on number of children, spouses and parents to avoid those displaying under/over the next kin*
[ ] can add one child to ANY node
[ ] can add one parent to ANY node
[ ] can add one siblings to ANY node
[ ] can add one spouses to ANY node
[ ] can add one children to ANY node
[ ] can add multiple instances of child to ANY node
[ ] can add multiple instances of parent to ANY node
[ ] can add multiple instances of siblings to ANY node
[ ] can add multiple instances of spouses to ANY node
[ ] can add multiple instances of children to ANY node
[ ] can delete child from ANY node's relations
[ ] can delete parent from ANY node's relations
[ ] can delete siblings from ANY node's relations
[ ] can delete spouses from ANY node's relations
[ ] can delete children from ANY node's relations
[ ] applies form validations to each step
[ ] disables the submit button if any step doesnt have all valid values
[ ] nodes are initially connected
[ ] nodes stay connected upon adding relation
[ ] nodes stay connected upon deleting relation
[ ] can create family tree name
[ ] can edit family tree name
[ ] can fetch and display existing family tree
[ ] clicking existing family tree redirects to form
[ ] upon redirects form is prefilled

