import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Household } from './households.entity';
import { User } from 'src/users/user.entity';
import { UserRoles } from 'src/users/user.inteface';

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

      const adminUser = await qr.manager.findOneBy(User, {
        id: parseInt(newHousehold.admin_id),
      });

      // since this user is the one creating the household, assign him the role of HOUSEHOLD_ADMIN
      adminUser.roles = [UserRoles.HOUSEHOLD_ADMIN];
      await qr.manager.save(adminUser);

      const household = new Household();
      Object.assign(household, {
        ...newHousehold,

        created: new Date(),
        members: [adminUser],
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
