import { Body, Controller, Param, Post } from '@nestjs/common';
import { Objective } from 'src/objectives/objectives.entity';
import { ObjectivesService } from 'src/objectives/objectives.service';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { UpdateMembersDTO } from './dto/update-members.dto';
import { Household } from './households.entity';
import { HouseholdsService } from './households.service';

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
  // HOW DO I USE THIS IN OBJECTIVE, AND WHY DOES UPDATING THE HOUSEHOLOD FROM OBJECTIVE FAILS IN THE FIRST PALCE
  async addObjective(householdId: number, objective: Objective) {
    const res = this.householdService.addObjective(householdId, objective);
    return res;
  }
}