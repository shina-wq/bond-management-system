import { Injectable } from '@nestjs/common';
import { CreateBondStatusHistoryDto } from './dto/create-bond_status_history.dto';
import { UpdateBondStatusHistoryDto } from './dto/update-bond_status_history.dto';

@Injectable()
export class BondStatusHistoryService {
  create(createBondStatusHistoryDto: CreateBondStatusHistoryDto) {
    return 'This action adds a new bondStatusHistory';
  }

  findAll() {
    return `This action returns all bondStatusHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bondStatusHistory`;
  }

  update(id: number, updateBondStatusHistoryDto: UpdateBondStatusHistoryDto) {
    return `This action updates a #${id} bondStatusHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} bondStatusHistory`;
  }
}
