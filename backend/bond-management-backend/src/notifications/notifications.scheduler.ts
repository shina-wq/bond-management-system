import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // Send bond expiry notification
  async sendBondExpiryNotification(bondId: string, daysUntilExpiry: number) {
    const bond = await this.prisma.bond_agreements.findUnique({
      where: { id: bondId },
      include: {
        employees_bond_agreements_employee_idToemployees: {
          include: {
            departments: true,
          },
        },
        training_providers: true,
      },
    });

    if (!bond) {
      this.logger.warn(`Bond ${bondId} not found for expiry notification`);
      return;
    }

    const employee = bond.employees_bond_agreements_employee_idToemployees;
    if (!employee) {
      this.logger.warn(`No employee linked to bond ${bondId}`);
      return;
    }

    const recipientEmail = 'hr@company.com';
    const recipientName = 'HR Team';

    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: `Bond Expiry Alert: ${daysUntilExpiry} days - ${employee.first_name} ${employee.last_name}`,
        template: 'bond-expiry-alert',
        context: {
          recipientName,
          employeeName: `${employee.first_name} ${employee.last_name}`,
          employeeId: employee.employee_id,
          trainingName: bond.training_name,
          trainingCost: bond.training_cost.toFixed(2),
          bondDuration: bond.bond_duration_months,
          expiryDate: bond.bond_end_date
            ? bond.bond_end_date.toLocaleDateString()
            : 'N/A',
          daysUntilExpiry,
        },
      });

      await this.prisma.notifications.create({
        data: {
          bond_id: bondId,
          rule_id: await this.getRuleIdForDays(daysUntilExpiry),
          recipient_id: employee.supervisor_id ?? 'default-hr-user-id',
          subject: `Bond Expiry in ${daysUntilExpiry} days`,
          body: `Bond for ${employee.first_name} ${employee.last_name} expires in ${daysUntilExpiry} days`,
          status: 'SENT',
        },
      });

      this.logger.log(
        `Expiry notification sent for bond ${bondId}, ${daysUntilExpiry} days remaining`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send expiry notification for bond ${bondId}:`,
        error,
      );

      await this.prisma.notifications.create({
        data: {
          bond_id: bondId,
          rule_id: await this.getRuleIdForDays(daysUntilExpiry),
          recipient_id: employee.supervisor_id ?? 'default-hr-user-id',
          subject: `Bond Expiry in ${daysUntilExpiry} days`,
          body: `Failed to send notification`,
          status: 'FAILED',
          retry_count: 1,
        },
      });
    }
  }

  // Send resignation alert
  async sendResignationAlert(employeeId: string, resignationDate: Date) {
    const employee = await this.prisma.employees.findUnique({
      where: { id: employeeId },
      include: {
        departments: true,
        bond_agreements_bond_agreements_employee_idToemployees: {
          where: { status: 'ACTIVE' },
          orderBy: { bond_end_date: 'desc' },
          take: 1,
        },
      },
    });

    if (
      !employee ||
      employee.bond_agreements_bond_agreements_employee_idToemployees.length ===
        0
    ) {
      this.logger.warn(
        `No active bond found for resigned employee ${employeeId}`,
      );
      return;
    }

    const bond =
      employee.bond_agreements_bond_agreements_employee_idToemployees[0];
    if (!bond.bond_end_date) {
      this.logger.warn(`Bond ${bond.id} has no end date, skipping calculation`);
      return;
    }

    const remainingDays = Math.ceil(
      (bond.bond_end_date.getTime() - resignationDate.getTime()) /
        (1000 * 3600 * 24),
    );

    if (remainingDays <= 0) return;

    try {
      await this.mailerService.sendMail({
        to: 'hr@company.com',
        subject: `🚨 BOND BREACH: ${employee.first_name} ${employee.last_name} Resigned`,
        template: 'resignation-alert',
        context: {
          employeeName: `${employee.first_name} ${employee.last_name}`,
          employeeId: employee.employee_id,
          position: employee.position,
          department: employee.departments?.name,
          trainingCost: bond.training_cost.toFixed(2),
          bondEndDate: bond.bond_end_date.toLocaleDateString(),
          resignationDate: resignationDate.toLocaleDateString(),
          remainingDays,
        },
      });

      await this.prisma.notifications.create({
        data: {
          bond_id: bond.id,
          rule_id: await this.getResignationRuleId(),
          recipient_id: await this.getHrUserId(),
          subject: `Bond Breach: ${employee.first_name} ${employee.last_name} Resigned`,
          body: `Employee resigned with ${remainingDays} days remaining on bond`,
          status: 'SENT',
        },
      });

      this.logger.log(`Resignation alert sent for employee ${employeeId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send resignation alert for employee ${employeeId}:`,
        error,
      );
    }
  }

  // Scheduled bond expiry notifications
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleBondExpiryNotifications() {
    this.logger.log('Running scheduled bond expiry notifications check');

    const today = new Date();
    const notificationIntervals = [90, 60, 30];

    for (const days of notificationIntervals) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + days);

      const expiringBonds = await this.prisma.bond_agreements.findMany({
        where: { status: 'ACTIVE', bond_end_date: { equals: targetDate } },
      });

      this.logger.log(
        `Found ${expiringBonds.length} bonds expiring in ${days} days`,
      );

      for (const bond of expiringBonds) {
        await this.sendBondExpiryNotification(bond.id, days);
      }
    }
  }

  private async getRuleIdForDays(days: number): Promise<string> {
    const rule = await this.prisma.notification_rules.findFirst({
      where: { days_before_event: days },
    });
    return rule?.id ?? 'default-rule-id';
  }

  private async getResignationRuleId(): Promise<string> {
    const rule = await this.prisma.notification_rules.findFirst({
      where: { name: 'Resignation Alert' },
    });
    return rule?.id ?? 'resignation-rule-id';
  }

  private async getHrUserId(): Promise<string> {
    const hrUser = await this.prisma.users.findFirst({
      where: { user_roles: { name: 'HR' } },
    });
    return hrUser?.id ?? 'default-hr-user-id';
  }
}
