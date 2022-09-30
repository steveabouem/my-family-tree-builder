import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HouseholdsController } from './households/household.controller';
import { TasksController } from './task/task.controller';
import { ObjectivesController } from './objective/objective.controller';
import { User } from './users/user.entity';
import { Household } from './households/household.entity';
import { UserModule } from './users/users.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, './.env') });
console.log('ENV VALUES', process.env);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      entities: [User, Household],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [
    AppController,
    HouseholdsController,
    TasksController,
    ObjectivesController,
  ],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
