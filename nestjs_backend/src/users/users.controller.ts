import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FetchUserDto } from './dto/fetch-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    const newUSer = this.userService.create(data);
    return newUSer;
  }

  @Get(':id')
  fetch(@Param() { id }) {
    const user = this.userService.fetch(id);
    return user;
  }

  @Delete(':id')
  delete(@Param() params): BaseResponseDto {
    return { success: true, message: 'Ok' };
  }

  @Patch()
  update(@Body() data: FetchUserDto): BaseResponseDto {
    return { success: true, message: 'Ok', data };
  }
}
