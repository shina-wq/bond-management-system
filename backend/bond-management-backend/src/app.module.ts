import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
