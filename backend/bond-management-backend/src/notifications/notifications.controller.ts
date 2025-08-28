import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN', 'HR')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('bond/:bondId')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findByBondId(@Param('bondId', ParseUUIDPipe) bondId: string) {
    return this.notificationsService.findByBondId(bondId);
  }

  @Get('status/:status')
  @Roles('ADMIN', 'HR')
  findByStatus(@Param('status') status: string) {
    return this.notificationsService.findByStatus(status);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGEMENT')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/mark-sent')
  @Roles('ADMIN', 'HR')
  markAsSent(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsSent(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }
}
