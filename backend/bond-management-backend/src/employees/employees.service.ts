import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    if (createEmployeeDto.department_id) {
      const department = await this.prisma.departments.findUnique({
        where: { id: createEmployeeDto.department_id },
      });
      if (!department)
        throw new NotFoundException(
          `Department with ID ${createEmployeeDto.department_id} not found`,
        );
    }

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
      orderBy: { first_name: 'asc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employees.findUnique({
      where: { id },
    });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    // Send resignation alert if employee becomes inactive
    if (updateEmployeeDto.is_active === false && employee.is_active === true) {
      await this.notificationsService.sendResignationAlert(id, new Date());
    }

    try {
      return await this.prisma.employees.update({
        where: { id },
        data: updateEmployeeDto,
      });
    } catch (error: any) {
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
    } catch (error: any) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Employee ${id} not found`);
      throw error;
    }
  }
}
