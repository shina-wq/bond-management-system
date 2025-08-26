import { Injectable } from '@nestjs/common';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

@Injectable()
export class BondAgreementsService {
  create(createBondAgreementDto: CreateBondAgreementDto) {
    return 'This action adds a new bondAgreement';
  }

  findAll() {
    return `This action returns all bondAgreements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bondAgreement`;
  }

  update(id: number, updateBondAgreementDto: UpdateBondAgreementDto) {
    return `This action updates a #${id} bondAgreement`;
  }

  remove(id: number) {
    return `This action removes a #${id} bondAgreement`;
  }
}
