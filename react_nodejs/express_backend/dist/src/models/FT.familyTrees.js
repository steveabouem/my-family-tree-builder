"use strict";
// import {
//     Association, DataTypes, HasManyCountAssociationsMixin,
//     HasManyGetAssociationsMixin, HasManySetAssociationsMixin,
//     HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
//     HasManyRemoveAssociationsMixin, Model, InferAttributes,
//     InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
// } from 'sequelize';
// import FTFam from './FT.family';
// import db from "../db";
// // order of InferAttributes & InferCreationAttributes is important.
// class FTUser extends Model<InferAttributes<FTUser, { omit: 'families' }>, InferCreationAttributes<FTUser>> {
//     // 'CreationOptional' is a special type that marks the field as optional
//     // when creating an instance of the model (such as using Model.create()).
//     declare id: CreationOptional<number>;
//     declare first_name: string;
//     declare last_name: string;
// }
// FTUser.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         profile_url: {
//             type: DataTypes.STRING,
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//     },
//     {
//         tableName: 'FTUsers',
//         sequelize: db, // passing the `sequelize` instance is required
//     }
// );
// export default FTUser;
