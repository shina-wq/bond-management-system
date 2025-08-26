import { Test, TestingModule } from '@nestjs/testing';
import { BondStatusHistoryService } from './bond_status_history.service';

describe('BondStatusHistoryService', () => {
  let service: BondStatusHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondStatusHistoryService],
    }).compile();

    service = module.get<BondStatusHistoryService>(BondStatusHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
