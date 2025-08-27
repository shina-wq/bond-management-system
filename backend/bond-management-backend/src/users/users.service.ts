import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if employee exists
    const employee = await this.prisma.employees.findUnique({
      where: { id: createUserDto.employee_id },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createUserDto.employee_id} not found`,
      );
    }

    // Check if role exists
    const role = await this.prisma.user_roles.findUnique({
      where: { id: createUserDto.role_id },
    });

    if (!role) {
      throw new NotFoundException(
        `User role with ID ${createUserDto.role_id} not found`,
      );
    }

    // Check if username already exists
    const existingUsername = await this.prisma.users.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUsername) {
      throw new ConflictException(
        `Username ${createUserDto.username} already exists`,
      );
    }

    // Check if employee already has a user account
    const existingEmployeeUser = await this.prisma.users.findUnique({
      where: { employee_id: createUserDto.employee_id },
    });

    if (existingEmployeeUser) {
      throw new ConflictException(`Employee already has a user account`);
    }

    return this.prisma.users.create({
      data: createUserDto,
      include: {
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
          include: {
            departments: true,
          },
        },
        user_roles: true,
      },
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      where: { is_active: true },
      include: {
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
          include: {
            departments: true,
          },
        },
        user_roles: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            position: true,
          },
          include: {
            departments: true,
          },
        },
        user_roles: true,
        audit_logs: {
          orderBy: { performed_at: 'desc' },
          take: 20, // Last 20 audit logs
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username },
      include: {
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        user_roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findByEmployeeId(employeeId: string) {
    const user = await this.prisma.users.findUnique({
      where: { employee_id: employeeId },
      include: {
        employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        user_roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User for employee ID ${employeeId} not found`,
      );
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Check if username is being updated and if it already exists
      if (updateUserDto.username) {
        const existingUsername = await this.prisma.users.findFirst({
          where: {
            username: updateUserDto.username,
            NOT: { id },
          },
        });

        if (existingUsername) {
          throw new ConflictException(
            `Username ${updateUserDto.username} already exists`,
          );
        }
      }

      return await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
        include: {
          employees: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          user_roles: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateLastLogin(id: string) {
    try {
      return await this.prisma.users.update({
        where: { id },
        data: { last_login: new Date() },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Soft delete by setting is_active to false
      return await this.prisma.users.update({
        where: { id },
        data: { is_active: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}
