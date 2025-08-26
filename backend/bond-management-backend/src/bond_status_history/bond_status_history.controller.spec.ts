import { Test, TestingModule } from '@nestjs/testing';
import { BondStatusHistoryController } from './bond_status_history.controller';
import { BondStatusHistoryService } from './bond_status_history.service';

describe('BondStatusHistoryController', () => {
  let controller: BondStatusHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BondStatusHistoryController],
      providers: [BondStatusHistoryService],
    }).compile();

    controller = module.get<BondStatusHistoryController>(BondStatusHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
