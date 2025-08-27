import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationRuleDto } from './dto/create-notification_rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification_rule.dto';

@Injectable()
export class NotificationRulesService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationRuleDto: CreateNotificationRuleDto) {
    // Check if rule with same name already exists
    const existingRule = await this.prisma.notification_rules.findFirst({
      where: {
        name: {
          equals: createNotificationRuleDto.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingRule) {
      throw new ConflictException(
        `Notification rule with name ${createNotificationRuleDto.name} already exists`,
      );
    }

    return this.prisma.notification_rules.create({
      data: createNotificationRuleDto,
    });
  }

  async findAll() {
    return this.prisma.notification_rules.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findActiveRules() {
    return this.prisma.notification_rules.findMany({
      where: { is_active: true },
      orderBy: { days_before_event: 'desc' },
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.notification_rules.findUnique({
      where: { id },
      include: {
        notifications: {
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
          },
          orderBy: { sent_at: 'desc' },
          take: 10, // Last 10 notifications
        },
      },
    });

    if (!rule) {
      throw new NotFoundException(`Notification rule with ID ${id} not found`);
    }

    return rule;
  }

  async findByName(name: string) {
    return this.prisma.notification_rules.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(
    id: string,
    updateNotificationRuleDto: UpdateNotificationRuleDto,
  ) {
    try {
      return await this.prisma.notification_rules.update({
        where: { id },
        data: updateNotificationRuleDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Notification rule with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async toggleActive(id: string, isActive: boolean) {
    try {
      return await this.prisma.notification_rules.update({
        where: { id },
        data: { is_active: isActive },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Notification rule with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if rule has associated notifications
      const notifications = await this.prisma.notifications.findMany({
        where: { rule_id: id },
        take: 1,
      });

      if (notifications.length > 0) {
        throw new ConflictException(
          'Cannot delete notification rule with associated notifications',
        );
      }

      return await this.prisma.notification_rules.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Notification rule with ID ${id} not found`,
        );
      }
      throw error;
    }
  }
}
