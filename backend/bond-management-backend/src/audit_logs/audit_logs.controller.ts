import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { AuditLogsService } from './audit_logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('table/:tableName')
  findByTable(@Param('tableName') tableName: string) {
    return this.auditLogsService.findByTable(tableName);
  }

  @Get('record/:tableName/:recordId')
  findByRecord(
    @Param('tableName') tableName: string,
    @Param('recordId', ParseUUIDPipe) recordId: string,
  ) {
    return this.auditLogsService.findByRecord(tableName, recordId);
  }

  @Get('performer/:performerId')
  findByPerformer(@Param('performerId', ParseUUIDPipe) performerId: string) {
    return this.auditLogsService.findByPerformer(performerId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.auditLogsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditLogsService.findOne(id);
  }
}
