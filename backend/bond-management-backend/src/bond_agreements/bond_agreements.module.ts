import { Module } from '@nestjs/common';
import { BondAgreementsService } from './bond_agreements.service';
import { BondAgreementsController } from './bond_agreements.controller';

@Module({
  controllers: [BondAgreementsController],
  providers: [BondAgreementsService],
})
export class BondAgreementsModule {}
