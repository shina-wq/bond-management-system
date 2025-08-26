import { Injectable } from '@nestjs/common';
import { CreateNotificationRuleDto } from './dto/create-notification_rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification_rule.dto';

@Injectable()
export class NotificationRulesService {
  create(createNotificationRuleDto: CreateNotificationRuleDto) {
    return 'This action adds a new notificationRule';
  }

  findAll() {
    return `This action returns all notificationRules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificationRule`;
  }

  update(id: number, updateNotificationRuleDto: UpdateNotificationRuleDto) {
    return `This action updates a #${id} notificationRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationRule`;
  }
}
