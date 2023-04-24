import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Objective } from './objectives.entity';
import initializeQueryRunner from 'src/common/helpers/initQuery';
import { CreateObjectiveDTO } from './dto/create-objective.dto';
import { Household } from 'src/households/households.entity';

@Injectable()
export class ObjectivesService {
  constructor(private dataSource: DataSource) {}

  async fetch(id: number): Promise<BaseResponseDto> {
    const qr = await initializeQueryRunner(this.dataSource);
    const objective = await qr.manager.findOneBy(Objective, { id });

    return { success: true, data: objective };
  }

  async create(newObjective: CreateObjectiveDTO): Promise<BaseResponseDto> {
    const qr = await initializeQueryRunner(this.dataSource);

    try {
      await qr.startTransaction();

      const household = await qr.manager.findOne(Household, {
        where: { id: parseInt(newObjective.household) },
        relations: ['objectives'],
        loadEagerRelations: true,
        loadRelationIds: true,
      });
      const objective = new Objective();

      Object.assign(objective, {
        itemDescription: newObjective.itemDescription,
        itemName: newObjective.itemName,
        households: [household],
      });
      await qr.manager.save(objective);

      household.objectives = [...household.objectives, objective];
      await qr.manager.save(household);

      await qr.commitTransaction();
      qr.release();

      return { success: true, data: objective };
    } catch (e) {
      qr.release();
      return { success: false, data: e };
    }
  }
}
