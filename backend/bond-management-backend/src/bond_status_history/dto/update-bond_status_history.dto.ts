import { PartialType } from '@nestjs/mapped-types';
import { CreateBondStatusHistoryDto } from './create-bond_status_history.dto';

export class UpdateBondStatusHistoryDto extends PartialType(CreateBondStatusHistoryDto) {}
