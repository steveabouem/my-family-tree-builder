import { Sequelize} from'@sequelize/core';
import dotenv from 'dotenv';
import db from './models';
  
  
  dotenv.config();
  const {DB_USER, DB_PWD, DB_HOST} = process.env;
  
const sequelize = new Sequelize('', DB_USER, DB_PWD, {
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