import { Module } from '@nestjs/common';
import { NotificationRulesService } from './notification_rules.service';
import { NotificationRulesController } from './notification_rules.controller';

@Module({
  controllers: [NotificationRulesController],
  providers: [NotificationRulesService],
})
export class NotificationRulesModule {}
