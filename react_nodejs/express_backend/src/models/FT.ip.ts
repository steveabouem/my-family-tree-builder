// 'use strict';
// const {
//     Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//     class FTIP extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate(models) {
//             FTIP.belongsTo(models.FTUser);
//         }
//     }
//     FTIP.init({
//         value: DataTypes.STRING,
//         owners: DataTypes.STRING, // '[FTUser.id]', can be shared
//     }, {
//         sequelize,
//         modelName: 'FTIP',
//     });
//     return FTIP;
// };



import {
    Association, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "../db";
import FTUser from './FT.user';


// order of InferAttributes & InferCreationAttributes is important.
class FTIP extends Model<InferAttributes<FTIP>, InferCreationAttributes<FTIP>> {
    /**
     * Attributes
     * */
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>;
    declare value: string;
    declare owners: number[]; // FTUser[]
    /**
     * End
     * */


    /**
     * Association Getters/Setters
     * */

    /**
     * End
     * */

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    declare members?: NonAttribute<FTUser[]>; // Note this is optional since it's only populated when explicitly requested in code

    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get FTIPId(): NonAttribute<number> {
        return this.id;
    }
    get FTIPValue(): NonAttribute<string> {
        return this.value;
    }
    get FTIPOwners(): NonAttribute<number[]> {
        return this.owners;
    }

    /**
     * End
     * */

    declare static associations: {
        projects: Association<FTIP, FTIP>;
    };
}

FTIP.init(
    {
        id: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        value: { type: DataTypes.STRING },
        owners: { type: DataTypes.JSON },

    },
    {
        timestamps: false,
        tableName: 'FTIPs',
        sequelize: db // passing the `sequelize` instance is required
    }
);

export default FTIP;