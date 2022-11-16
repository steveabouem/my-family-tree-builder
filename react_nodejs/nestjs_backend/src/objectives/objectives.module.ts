import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/tasks.entity';
import { ObjectivesController } from './objectives.controller';
import { Objective } from './objectives.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objective])],
  controllers: [ObjectivesController],
//   providers: [HouseholdsService],
})

export class ObjectivesModule {}
