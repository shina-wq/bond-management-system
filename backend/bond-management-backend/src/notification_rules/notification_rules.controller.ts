import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationRulesService } from './notification_rules.service';
import { CreateNotificationRuleDto } from './dto/create-notification_rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification_rule.dto';

@Controller('notification-rules')
export class NotificationRulesController {
  constructor(private readonly notificationRulesService: NotificationRulesService) {}

  @Post()
  create(@Body() createNotificationRuleDto: CreateNotificationRuleDto) {
    return this.notificationRulesService.create(createNotificationRuleDto);
  }

  @Get()
  findAll() {
    return this.notificationRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationRuleDto: UpdateNotificationRuleDto) {
    return this.notificationRulesService.update(+id, updateNotificationRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationRulesService.remove(+id);
  }
}
