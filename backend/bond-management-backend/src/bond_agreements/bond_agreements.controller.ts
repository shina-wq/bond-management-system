import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BondsAgreementService } from './bond_agreements.service';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

@Controller('bonds')
export class BondsController {
  constructor(private readonly bondsAgreementService: BondsAgreementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBondDto: CreateBondAgreementDto) {
    return this.bondsAgreementService.create(createBondDto);
  }

  @Get()
  findAll() {
    return this.bondsAgreementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bondsAgreementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBondDto: UpdateBondAgreementDto,
  ) {
    return this.bondsAgreementService.update(id, updateBondDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bondsAgreementService.remove(id);
  }
}
