import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { UpdateMembersDTO } from './dto/update-members.dto';
import { HouseholdsService as HouseholdsService } from './households.service';

@Controller('households')
export class HouseholdsController {
  constructor(private readonly householdService: HouseholdsService) {}

  @Post()
  create(@Body() data: CreateHouseholdDTO) {
    const newHousehold = this.householdService.create(data);

    return newHousehold;
  }

  @Post(':householdId')
  updateMembers(@Body() data: UpdateMembersDTO, @Param() { householdId }) {
    const { userId } = data;
    const updatedHousehold = this.householdService.addMember(
      userId,
      householdId,
    );

    return updatedHousehold;
  }
}