import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_USER, DB_PWD, DB_HOST, DB }: { [key: string]: string | undefined } = process.env;

const sequelize = new Sequelize(DB || '', DB_USER || '', DB_PWD, {
    host: DB_HOST,
    dialect: 'mysql'
});
// Sync the models with the database
sequelize.sync({alter: true}).then(() => {
    console.log('Tables created successfully.');
}).catch((error) => {
    console.error('Unable to create tables:', error);
});

// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }

export default sequelize;