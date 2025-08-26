import { PartialType } from '@nestjs/mapped-types';
import { CreateBondAgreementDto } from './create-bond_agreement.dto';

export class UpdateBondAgreementDto extends PartialType(CreateBondAgreementDto) {}
