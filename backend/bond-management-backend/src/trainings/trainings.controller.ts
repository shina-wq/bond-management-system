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
import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'HR')
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingsService.create(createTrainingDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
  ) {
    return this.trainingsService.update(id, updateTrainingDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingsService.remove(id);
  }
}
