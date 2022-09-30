import { Injectable } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async create(newUser: CreateUserDto): Promise<BaseResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const duplicate = await queryRunner.manager.findOneBy(User, {
      email: newUser.email,
    });

    try {
      if (duplicate) {
        return;
      } else {
        const user = new User();
        Object.assign(user, {
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          password: newUser.password,
          created: new Date(),
        });

        await queryRunner.manager.save(user);
        await queryRunner.commitTransaction();
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
      return { success: !!duplicate, data: duplicate };
    }

  }
}
