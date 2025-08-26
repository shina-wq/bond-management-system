import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainingProvidersService } from './training_providers.service';
import { CreateTrainingProviderDto } from './dto/create-training_provider.dto';
import { UpdateTrainingProviderDto } from './dto/update-training_provider.dto';

@Controller('training-providers')
export class TrainingProvidersController {
  constructor(private readonly trainingProvidersService: TrainingProvidersService) {}

  @Post()
  create(@Body() createTrainingProviderDto: CreateTrainingProviderDto) {
    return this.trainingProvidersService.create(createTrainingProviderDto);
  }

  @Get()
  findAll() {
    return this.trainingProvidersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingProvidersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingProviderDto: UpdateTrainingProviderDto) {
    return this.trainingProvidersService.update(+id, updateTrainingProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingProvidersService.remove(+id);
  }
}
