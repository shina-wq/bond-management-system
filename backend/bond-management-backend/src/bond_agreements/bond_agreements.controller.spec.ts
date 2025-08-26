import { Test, TestingModule } from '@nestjs/testing';
import { BondAgreementsController } from './bond_agreements.controller';
import { BondAgreementsService } from './bond_agreements.service';

describe('BondAgreementsController', () => {
  let controller: BondAgreementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BondAgreementsController],
      providers: [BondAgreementsService],
    }).compile();

    controller = module.get<BondAgreementsController>(BondAgreementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
