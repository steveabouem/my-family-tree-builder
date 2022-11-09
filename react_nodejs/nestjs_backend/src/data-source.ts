import { DataSource } from 'typeorm';

/**
 * This file is used solely for migrations. An argument for the dataSource file path is required
 * for the migration script to run
 */
export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rootpass',
  database: 'tracker',
  migrations: [__dirname + '/./migrations/*.ts'],
  // entities: [User, Household],
  synchronize: true,
});
