import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity';
import { Household } from './households/households.entity';
import { UsersModule } from './users/users.module';
import { HouseholdsModule } from './households/households.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/tasks.entity';
import { Objective } from './objectives/objectives.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootpass',
      database: 'tracker',
      entities: [User, Household, Task, Objective],
      synchronize: true,
    }),
    UsersModule,
    HouseholdsModule,
    ObjectivesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
