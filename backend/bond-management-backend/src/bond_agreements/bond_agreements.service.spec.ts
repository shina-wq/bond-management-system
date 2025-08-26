import { Test, TestingModule } from '@nestjs/testing';
import { BondAgreementsService } from './bond_agreements.service';

describe('BondAgreementsService', () => {
  let service: BondAgreementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondAgreementsService],
    }).compile();

    service = module.get<BondAgreementsService>(BondAgreementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
