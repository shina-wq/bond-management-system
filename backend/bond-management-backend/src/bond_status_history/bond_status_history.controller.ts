import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BondStatusHistoryService } from './bond_status_history.service';
import { CreateBondStatusHistoryDto } from './dto/create-bond_status_history.dto';
import { UpdateBondStatusHistoryDto } from './dto/update-bond_status_history.dto';

@Controller('bond-status-history')
export class BondStatusHistoryController {
  constructor(private readonly bondStatusHistoryService: BondStatusHistoryService) {}

  @Post()
  create(@Body() createBondStatusHistoryDto: CreateBondStatusHistoryDto) {
    return this.bondStatusHistoryService.create(createBondStatusHistoryDto);
  }

  @Get()
  findAll() {
    return this.bondStatusHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bondStatusHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBondStatusHistoryDto: UpdateBondStatusHistoryDto) {
    return this.bondStatusHistoryService.update(+id, updateBondStatusHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bondStatusHistoryService.remove(+id);
  }
}
