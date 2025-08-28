import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';

import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { EmployeesModule } from './employees/employees.module';
import { TrainingProvidersModule } from './training_providers/training_providers.module';
import { BondAgreementsModule } from './bond_agreements/bond_agreements.module';
import { BondStatusHistoryModule } from './bond_status_history/bond_status_history.module';
import { NotificationRulesModule } from './notification_rules/notification_rules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserRolesModule } from './user_roles/user_roles.module';
import { UsersModule } from './users/users.module';
import { AuditLogsModule } from './audit_logs/audit_logs.module';
import { TrainingsModule } from './trainings/trainings.module';
import { DepartmentsModule } from './departments/departments.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserRolesModule,
    EmployeesModule,
    TrainingProvidersModule,
    BondAgreementsModule,
    BondStatusHistoryModule,
    NotificationRulesModule,
    NotificationsModule,
    UsersModule,
    AuditLogsModule,
    TrainingsModule,
    DepartmentsModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
