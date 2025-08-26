import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationRuleDto } from './create-notification_rule.dto';

export class UpdateNotificationRuleDto extends PartialType(CreateNotificationRuleDto) {}
