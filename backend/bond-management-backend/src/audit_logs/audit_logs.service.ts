import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.audit_logs.findMany({
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { performed_at: 'desc' },
      take: 100, // Limit to recent 100 logs
    });
  }

  async findOne(id: string) {
    const auditLog = await this.prisma.audit_logs.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!auditLog) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return auditLog;
  }

  async findByTable(tableName: string) {
    return this.prisma.audit_logs.findMany({
      where: { table_name: tableName },
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { performed_at: 'desc' },
      take: 50,
    });
  }

  async findByRecord(tableName: string, recordId: string) {
    return this.prisma.audit_logs.findMany({
      where: {
        table_name: tableName,
        record_id: recordId,
      },
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { performed_at: 'desc' },
    });
  }

  async findByPerformer(performerId: string) {
    const performer = await this.prisma.users.findUnique({
      where: { id: performerId },
    });

    if (!performer) {
      throw new NotFoundException(`Performer with ID ${performerId} not found`);
    }

    return this.prisma.audit_logs.findMany({
      where: { performed_by: performerId },
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { performed_at: 'desc' },
      take: 50,
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.audit_logs.findMany({
      where: {
        performed_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        users: {
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: { performed_at: 'desc' },
    });
  }
}
