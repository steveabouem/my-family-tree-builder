import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Household } from './households.entity';
import { User } from 'src/users/users.entity';
import { UserRoles } from 'src/users/user.inteface';
import initializeQueryRunner from 'src/common/helpers/initQuery';

@Injectable()
export class HouseholdsService {
  constructor(private dataSource: DataSource) {}

  async fetch(id: number): Promise<BaseResponseDto> {
    const qr = await initializeQueryRunner(this.dataSource);
    const household = await qr.manager.findOneBy(Household, { id });

    return { success: true, data: household };
  }

  async create(newHousehold: CreateHouseholdDTO): Promise<BaseResponseDto> {
    const qr = await initializeQueryRunner(this.dataSource);

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

  async addMember(memberId: string, householdId: string) {
    const qr = await initializeQueryRunner(this.dataSource);

    const user = await qr.manager.findOneBy(User, { id: parseInt(memberId) });
    const household = await qr.manager.findOneBy(Household, {
      id: parseInt(householdId),
    });
    await qr.startTransaction();

    household.members = [...household.members, user];
    await qr.manager.save(household);
    await qr.commitTransaction();
    qr.release();

    return { success: true, data: household };
  }
}
