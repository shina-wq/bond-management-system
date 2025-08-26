import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRulesService } from './notification_rules.service';

describe('NotificationRulesService', () => {
  let service: NotificationRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationRulesService],
    }).compile();

    service = module.get<NotificationRulesService>(NotificationRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
