import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrainingProvidersService } from './training_providers.service';
import { CreateTrainingProviderDto } from './dto/create-training_provider.dto';
import { UpdateTrainingProviderDto } from './dto/update-training_provider.dto';

@Controller('training-providers')
export class TrainingProvidersController {
  constructor(
    private readonly trainingProvidersService: TrainingProvidersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrainingProviderDto: CreateTrainingProviderDto) {
    return this.trainingProvidersService.create(createTrainingProviderDto);
  }

  @Get()
  findAll() {
    return this.trainingProvidersService.findAll();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.trainingProvidersService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingProvidersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrainingProviderDto: UpdateTrainingProviderDto,
  ) {
    return this.trainingProvidersService.update(id, updateTrainingProviderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingProvidersService.remove(id);
  }
}
