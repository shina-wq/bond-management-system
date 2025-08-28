import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit_logs.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT') // Only admin, HR, and management can view all logs
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('table/:tableName')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findByTable(@Param('tableName') tableName: string) {
    return this.auditLogsService.findByTable(tableName);
  }

  @Get('record/:tableName/:recordId')
  @Roles('ADMIN', 'HR', 'MANAGEMENT', 'LEGAL')
  findByRecord(
    @Param('tableName') tableName: string,
    @Param('recordId', ParseUUIDPipe) recordId: string,
  ) {
    return this.auditLogsService.findByRecord(tableName, recordId);
  }

  @Get('performer/:performerId')
  @Roles('ADMIN')
  findByPerformer(@Param('performerId', ParseUUIDPipe) performerId: string) {
    return this.auditLogsService.findByPerformer(performerId);
  }

  @Get('date-range')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
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
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditLogsService.findOne(id);
  }
}
