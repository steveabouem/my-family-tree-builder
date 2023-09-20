"use strict";
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class FTTree extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       // FTTree.hasMany(models.FTFam);
//     }
//   }
//   FTTree.init({
//     authorized_ips: DataTypes.JSON,
//     public: DataTypes.INTEGER,
//     name: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'FTTree',
//   });
//   return FTTree;
// };
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class FTTree extends sequelize_1.Model {
    /**
     * End
     * */
    /**
     * Association Getters/Setters
     * */
    // FTFAM 
    // declare getFamilies: HasManyGetAssociationsMixin<FTFam>; // Note the null assertions!
    // declare setFamilies: HasManySetAssociationsMixin<FTFam, number>;
    // declare addFamilies: HasManyAddAssociationsMixin<FTFam, number>;
    // declare removeFamilies: HasManyRemoveAssociationsMixin<FTFam, number>;
    // declare hasFamilies: HasManyHasAssociationsMixin<FTFam, number>;
    // declare countFamilies: HasManyCountAssociationsMixin;
    /**
     * End
     * */
    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    // declare families?: NonAttribute<FTFam[]>; // Note this is optional since it's only populated when explicitly requested in code
    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FTTreeId() {
        return this.id;
    }
    get FTTreeAuthorized_ips() {
        return this.authorized_ips;
    }
    ;
    get FTTreePublic() {
        return this.public;
    }
    ;
    get FTTreeName() {
        return this.name;
    }
    ;
    get FTTreeCreated_by() {
        return this.created_by;
    }
    get FTTreeActive() {
        return this.active;
    }
    get FTTreeCreatedAt() {
        return this.created_at;
    }
    get FTTreeUpdatedAt() {
        return this.updated_at;
    }
    get FTTreeFAmilies() {
        return this.families;
    }
    ;
}
FTTree.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    authorized_ips: {
        type: sequelize_1.DataTypes.JSON
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    },
    created_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    families: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: '[]'
    },
    public: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
    active: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'FTTrees',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
// FTTree.hasMany(FTFam, {
//   as: 'families',
//   sourceKey: 'id',
//   foreignKey: 'families'
// });
exports.default = FTTree;
