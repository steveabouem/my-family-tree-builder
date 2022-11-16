import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objective } from 'src/objectives/objectives.entity';
import { HouseholdsController } from './households.controller';
import { Household } from './households.entity';
import { HouseholdsService } from './households.service';

@Module({
  imports: [TypeOrmModule.forFeature([Household])],
  controllers: [HouseholdsController],
  providers: [HouseholdsService],
})

export class HouseholdsModule {}
