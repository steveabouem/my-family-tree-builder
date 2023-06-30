"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: types
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// TODO: types
dotenv_1.default.config();
const { DB_USER, DB_PWD, DB_HOST, DB } = process.env;
const sequelize = new sequelize_1.Sequelize(DB || '', DB_USER || '', DB_PWD, {
    host: DB_HOST,
    dialect: 'mysql'
});
// Sync the models with the database
sequelize.sync({ force: true }).then(() => {
    console.log('Tables created successfully.');
}).catch((error) => {
    console.error('Unable to create tables:', error);
});
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
exports.default = sequelize;
