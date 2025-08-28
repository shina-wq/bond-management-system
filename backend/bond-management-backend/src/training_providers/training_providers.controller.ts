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
  UseGuards,
} from '@nestjs/common';
import { TrainingProvidersService } from './training_providers.service';
import { CreateTrainingProviderDto } from './dto/create-training_provider.dto';
import { UpdateTrainingProviderDto } from './dto/update-training_provider.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('training-providers')
@UseGuards(JwtAuthGuard)
export class TrainingProvidersController {
  constructor(
    private readonly trainingProvidersService: TrainingProvidersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'HR')
  create(@Body() createTrainingProviderDto: CreateTrainingProviderDto) {
    return this.trainingProvidersService.create(createTrainingProviderDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.trainingProvidersService.findAll();
  }

  @Get('search')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findByName(@Query('name') name: string) {
    return this.trainingProvidersService.findByName(name);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingProvidersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrainingProviderDto: UpdateTrainingProviderDto,
  ) {
    return this.trainingProvidersService.update(id, updateTrainingProviderDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingProvidersService.remove(id);
  }
}
