import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HouseholdsController } from './households/household.controller';
import { TasksController } from './task/task.controller';
import { ObjectivesController } from './objective/objective.controller';
import { User } from './users/user.entity';
import { Household } from './households/household.entity';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootpass',
      database: 'tracker',
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
