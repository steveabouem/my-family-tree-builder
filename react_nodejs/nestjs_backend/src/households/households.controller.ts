import { Body, Controller, Post } from '@nestjs/common';
import { CreateHouseholdDTO } from './dto/create-household.dto';
import { HouseholdsService as HouseholdsService } from './households.service';

@Controller('households')
export class HouseholdsController {
  constructor(private readonly householdService: HouseholdsService) {}

  @Post()
  create(@Body() data: CreateHouseholdDTO) {
    const newHousehold = this.householdService.create(data);

    return newHousehold;
  }
}
