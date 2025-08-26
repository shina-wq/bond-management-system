import { Module } from '@nestjs/common';
import { BondsAgreementService } from './bond_agreements.service';
import { BondsAgreementController } from './bond_agreements.controller';

@Module({
  controllers: [BondsAgreementController],
  providers: [BondsAgreementService],
})
export class BondAgreementsModule {}
