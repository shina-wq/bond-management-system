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
  UseGuards,
} from '@nestjs/common';
import { BondsAgreementService } from './bond_agreements.service';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('bonds')
@UseGuards(JwtAuthGuard)
export class BondsAgreementController {
  constructor(private readonly bondsAgreementService: BondsAgreementService) {}

  @Post()
  @Roles('HR', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBondDto: CreateBondAgreementDto) {
    // Only accessible to HR and Admin
    return this.bondsAgreementService.create(createBondDto);
  }

  @Get()
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findAll() {
    // Only accessible to HR, Management, Admin, Legal
    return this.bondsAgreementService.findAll();
  }

  @Get(':id')
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Accessible to HR, Management, Admin, Legal
    return this.bondsAgreementService.findOne(id);
  }

  @Patch(':id')
  @Roles('HR', 'ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBondDto: UpdateBondAgreementDto,
  ) {
    // Only HR and Admin can update
    return this.bondsAgreementService.update(id, updateBondDto);
  }

  @Delete(':id')
  @Roles('HR', 'ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // Only HR and Admin can delete
    return this.bondsAgreementService.remove(id);
  }

  @Get('reports/financial-exposure/department')
  @Roles('MANAGEMENT', 'FINANCE', 'ADMIN')
  getFinancialExposureByDepartment() {
    //  Only accessible to Management, Finance, Admin
    return this.bondsAgreementService.getFinancialExposureByDepartment();
  }
}
