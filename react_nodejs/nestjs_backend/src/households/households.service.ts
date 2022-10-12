import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Household } from './households.entity';

@Injectable()
export class HouseholdsService {
  constructor(private dataSource: DataSource) {}

  async create(newHousehold: CreateHouseholdDTO): Promise<BaseResponseDto> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      // if (!admin) {
      //   throw new HttpException(
      //     'Unable to locate current user.',
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // } else {
      await qr.startTransaction();

      const household = new Household();
      Object.assign(household, {
        ...newHousehold,
        created: new Date(),
      });

      await qr.manager.save(household);
      await qr.commitTransaction();
      qr.release();

      return { success: true, data: household };
    } catch (e) {
      qr.release();
      return { success: false, data: e };
    }
  }
}
