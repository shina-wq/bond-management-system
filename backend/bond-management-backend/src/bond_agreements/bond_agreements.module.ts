import { Module } from '@nestjs/common';
import { BondsAgreementService } from './bond_agreements.service';
import { BondsAgreementController } from './bond_agreements.controller';
import { StorageModule } from 'src/storage/storage.module';
@Module({
  imports: [StorageModule],
  controllers: [BondsAgreementController],
  providers: [BondsAgreementService],
})
export class BondAgreementsModule {}
