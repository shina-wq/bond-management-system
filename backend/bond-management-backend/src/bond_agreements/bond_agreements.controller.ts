import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BondAgreementsService } from './bond_agreements.service';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

@Controller('bond-agreements')
export class BondAgreementsController {
  constructor(private readonly bondAgreementsService: BondAgreementsService) {}

  @Post()
  create(@Body() createBondAgreementDto: CreateBondAgreementDto) {
    return this.bondAgreementsService.create(createBondAgreementDto);
  }

  @Get()
  findAll() {
    return this.bondAgreementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bondAgreementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBondAgreementDto: UpdateBondAgreementDto) {
    return this.bondAgreementsService.update(+id, updateBondAgreementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bondAgreementsService.remove(+id);
  }
}
