import { Module } from '@nestjs/common';
import { BondStatusHistoryService } from './bond_status_history.service';
import { BondStatusHistoryController } from './bond_status_history.controller';

@Module({
  controllers: [BondStatusHistoryController],
  providers: [BondStatusHistoryService],
})
export class BondStatusHistoryModule {}
