import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // Verify all foreign keys exist
    const [bond, rule, recipient] = await Promise.all([
      this.prisma.bond_agreements.findUnique({
        where: { id: createNotificationDto.bond_id },
      }),
      this.prisma.notification_rules.findUnique({
        where: { id: createNotificationDto.rule_id },
      }),
      this.prisma.employees.findUnique({
        where: { id: createNotificationDto.recipient_id },
      }),
    ]);

    if (!bond)
      throw new NotFoundException(
        `Bond with ID ${createNotificationDto.bond_id} not found`,
      );
    if (!rule)
      throw new NotFoundException(
        `Notification rule with ID ${createNotificationDto.rule_id} not found`,
      );
    if (!recipient)
      throw new NotFoundException(
        `Recipient with ID ${createNotificationDto.recipient_id} not found`,
      );

    return this.prisma.notifications.create({
      data: createNotificationDto,
      include: {
        bond_agreements: {
          include: {
            employees_bond_agreements_employee_idToemployees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        notification_rules: true,
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.notifications.findMany({
      include: {
        bond_agreements: {
          include: {
            employees_bond_agreements_employee_idToemployees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        notification_rules: true,
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: { sent_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notifications.findUnique({
      where: { id },
      include: {
        bond_agreements: {
          include: {
            employees_bond_agreements_employee_idToemployees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        notification_rules: true,
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async findByBondId(bondId: string) {
    const bond = await this.prisma.bond_agreements.findUnique({
      where: { id: bondId },
    });

    if (!bond) {
      throw new NotFoundException(`Bond with ID ${bondId} not found`);
    }

    return this.prisma.notifications.findMany({
      where: { bond_id: bondId },
      include: {
        notification_rules: true,
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: { sent_at: 'desc' },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.notifications.findMany({
      where: { status },
      include: {
        bond_agreements: {
          include: {
            employees_bond_agreements_employee_idToemployees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        notification_rules: true,
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: { sent_at: 'desc' },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      return await this.prisma.notifications.update({
        where: { id },
        data: updateNotificationDto,
        include: {
          bond_agreements: {
            include: {
              employees_bond_agreements_employee_idToemployees: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          notification_rules: true,
          employees: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.notifications.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      throw error;
    }
  }

  async markAsSent(id: string) {
    try {
      return await this.prisma.notifications.update({
        where: { id },
        data: {
          status: 'SENT',
          sent_at: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      throw error;
    }
  }
}
