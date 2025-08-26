import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRulesController } from './notification_rules.controller';
import { NotificationRulesService } from './notification_rules.service';

describe('NotificationRulesController', () => {
  let controller: NotificationRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationRulesController],
      providers: [NotificationRulesService],
    }).compile();

    controller = module.get<NotificationRulesController>(NotificationRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
