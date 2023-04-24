import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateObjectiveDTO } from './dto/create-objective.dto';
import { ObjectivesService } from './objectives.service';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectiveService: ObjectivesService) {}

  @Get(':id')
  fetch(@Param() { id }) {
    const objective = this.objectiveService.fetch(id);
    return objective;
  }

  @Post()
  create(@Body() data: CreateObjectiveDTO) {
    const newObjective = this.objectiveService.create(data);
    return newObjective;
  }
}
