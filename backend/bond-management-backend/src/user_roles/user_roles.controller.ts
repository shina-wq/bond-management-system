import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user-roles')
@UseGuards(JwtAuthGuard)
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(+id, updateUserRoleDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userRolesService.remove(+id);
  }
}
