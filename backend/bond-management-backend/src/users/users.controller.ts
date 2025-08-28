import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN', 'HR')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('username/:username')
  @Roles('ADMIN', 'HR')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get('employee/:employeeId')
  @Roles('ADMIN', 'HR')
  findByEmployeeId(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.usersService.findByEmployeeId(employeeId);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/update-login')
  @Roles('ADMIN')
  updateLastLogin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.updateLastLogin(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
