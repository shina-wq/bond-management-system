import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BondStatusHistoryService } from './bond_status_history.service';
import { CreateBondStatusHistoryDto } from './dto/create-bond_status_history.dto';
import { UpdateBondStatusHistoryDto } from './dto/update-bond_status_history.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('bond-status-history')
@UseGuards(JwtAuthGuard)
export class BondStatusHistoryController {
  constructor(
    private readonly bondStatusHistoryService: BondStatusHistoryService,
  ) {}

  @Post()
  @Roles('HR', 'ADMIN')
  create(@Body() createBondStatusHistoryDto: CreateBondStatusHistoryDto) {
    return this.bondStatusHistoryService.create(createBondStatusHistoryDto);
  }

  @Get()
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findAll() {
    return this.bondStatusHistoryService.findAll();
  }

  @Get(':id')
  @Roles('HR', 'MANAGEMENT', 'ADMIN', 'LEGAL')
  findOne(@Param('id') id: string) {
    return this.bondStatusHistoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateBondStatusHistoryDto: UpdateBondStatusHistoryDto,
  ) {
    return this.bondStatusHistoryService.update(
      +id,
      updateBondStatusHistoryDto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.bondStatusHistoryService.remove(+id);
  }
}
