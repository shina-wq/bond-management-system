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
import { NotificationRulesService } from './notification_rules.service';
import { CreateNotificationRuleDto } from './dto/create-notification_rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification_rule.dto';

@Controller('notification-rules')
export class NotificationRulesController {
  constructor(
    private readonly notificationRulesService: NotificationRulesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNotificationRuleDto: CreateNotificationRuleDto) {
    return this.notificationRulesService.create(createNotificationRuleDto);
  }

  @Get()
  findAll() {
    return this.notificationRulesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.notificationRulesService.findActiveRules();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.notificationRulesService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationRulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationRuleDto: UpdateNotificationRuleDto,
  ) {
    return this.notificationRulesService.update(id, updateNotificationRuleDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('is_active') isActive: boolean,
  ) {
    return this.notificationRulesService.toggleActive(id, isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationRulesService.remove(id);
  }
}
