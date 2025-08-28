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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'HR')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('stats')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  getStats() {
    return this.departmentsService.getDepartmentStats();
  }

  @Get('search')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findByName(@Query('name') name: string) {
    return this.departmentsService.findByName(name);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.departmentsService.remove(id);
  }
}
