import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const duplicate = await queryRunner.manager.findOneBy(User, {
      email: newUser.email,
    });

    try {
      if (duplicate) {
        throw new HttpException('Duplicate email.', HttpStatus.FORBIDDEN);
      } else {
        await queryRunner.startTransaction();
        const user = new User();
        Object.assign(user, {
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          password: newUser.password,
          created: new Date().toUTCString(),
        });

        await queryRunner.manager.save(user);
        await queryRunner.commitTransaction();
        queryRunner.release();
      }
    } catch (e) {
      queryRunner.release();
      return { success: !duplicate, data: e };
    }
  }

  async fetch(userId: string): Promise<User> {
    const user = await this.dataSource.manager
      .createQueryBuilder(User, 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    return user;
  }
}
