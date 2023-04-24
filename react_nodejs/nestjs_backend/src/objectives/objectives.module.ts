import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectivesController } from './objectives.controller';
import { Objective } from './objectives.entity';
import { ObjectivesService } from './objectives.service';

@Module({
  imports: [TypeOrmModule.forFeature([Objective])],
  controllers: [ObjectivesController],
  providers: [ObjectivesService],
})

export class ObjectivesModule {}
