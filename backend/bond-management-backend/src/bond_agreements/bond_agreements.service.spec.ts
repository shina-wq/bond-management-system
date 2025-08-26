import { Test, TestingModule } from '@nestjs/testing';
import { BondsAgreementService } from './bond_agreements.service';

describe('BondAgreementsService', () => {
  let service: BondsAgreementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondsAgreementService],
    }).compile();

    service = module.get<BondsAgreementService>(BondsAgreementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
