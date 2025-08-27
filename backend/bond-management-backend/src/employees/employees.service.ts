import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Check if department exists if provided
    if (createEmployeeDto.department_id) {
      const department = await this.prisma.departments.findUnique({
        where: { id: createEmployeeDto.department_id },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${createEmployeeDto.department_id} not found`,
        );
      }
    }
    // Check for existing employee_id, email, and phone_number
    const existingEmployee = await this.prisma.employees.findUnique({
      where: { employee_id: createEmployeeDto.employee_id },
    });
    if (existingEmployee)
      throw new ConflictException(
        `Employee ID ${createEmployeeDto.employee_id} exists`,
      );

    const existingEmail = await this.prisma.employees.findUnique({
      where: { email: createEmployeeDto.email },
    });
    if (existingEmail)
      throw new ConflictException(`Email ${createEmployeeDto.email} exists`);

    if (createEmployeeDto.phone_number) {
      const existingPhone = await this.prisma.employees.findUnique({
        where: { phone_number: createEmployeeDto.phone_number },
      });
      if (existingPhone)
        throw new ConflictException(
          `Phone ${createEmployeeDto.phone_number} exists`,
        );
    }

    return this.prisma.employees.create({ data: createEmployeeDto });
  }

  async findAll() {
    return this.prisma.employees.findMany({
      where: { is_active: true },
      include: {
        employees: {
          select: { first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { first_name: 'asc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employees.findUnique({
      where: { id },
      include: {
        employees: {
          select: { first_name: true, last_name: true, email: true },
        },
        other_employees: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            position: true,
          },
        },
        bond_agreements_bond_agreements_employee_idToemployees: {
          include: { training_providers: { select: { name: true } } },
        },
      },
    });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      // Check if department exists if being updated
      if (updateEmployeeDto.department_id) {
        const department = await this.prisma.departments.findUnique({
          where: { id: updateEmployeeDto.department_id },
        });
        if (!department) {
          throw new NotFoundException(
            `Department with ID ${updateEmployeeDto.department_id} not found`,
          );
        }
      }
      // Check for unique constraint violations
      if (updateEmployeeDto.email) {
        const existingEmail = await this.prisma.employees.findFirst({
          where: { email: updateEmployeeDto.email, NOT: { id } },
        });
        if (existingEmail)
          throw new ConflictException(
            `Email ${updateEmployeeDto.email} exists`,
          );
      }

      if (updateEmployeeDto.phone_number) {
        const existingPhone = await this.prisma.employees.findFirst({
          where: { phone_number: updateEmployeeDto.phone_number, NOT: { id } },
        });
        if (existingPhone)
          throw new ConflictException(
            `Phone ${updateEmployeeDto.phone_number} exists`,
          );
      }

      return await this.prisma.employees.update({
        where: { id },
        data: updateEmployeeDto,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Employee ${id} not found`);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.employees.update({
        where: { id },
        data: { is_active: false },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Employee ${id} not found`);
      throw error;
    }
  }
}
