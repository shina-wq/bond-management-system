import { JwtGuard } from './../jwt/jwt.guard';
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
import { NotificationRulesService } from './notification_rules.service';
import { CreateNotificationRuleDto } from './dto/create-notification_rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification_rule.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('notification-rules')
@UseGuards(JwtGuard)
export class NotificationRulesController {
  constructor(
    private readonly notificationRulesService: NotificationRulesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'HR')
  create(@Body() createNotificationRuleDto: CreateNotificationRuleDto) {
    return this.notificationRulesService.create(createNotificationRuleDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.notificationRulesService.findAll();
  }

  @Get('active')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findActive() {
    return this.notificationRulesService.findActiveRules();
  }

  @Get('search')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findByName(@Query('name') name: string) {
    return this.notificationRulesService.findByName(name);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationRulesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationRuleDto: UpdateNotificationRuleDto,
  ) {
    return this.notificationRulesService.update(id, updateNotificationRuleDto);
  }

  @Patch(':id/toggle-active')
  @Roles('ADMIN', 'HR')
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('is_active') isActive: boolean,
  ) {
    return this.notificationRulesService.toggleActive(id, isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationRulesService.remove(id);
  }
}
