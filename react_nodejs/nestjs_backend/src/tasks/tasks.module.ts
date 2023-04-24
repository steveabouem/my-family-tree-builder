import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objective } from 'src/objectives/objectives.entity';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
//   providers: [HouseholdsService],
})

export class TasksModule {}
