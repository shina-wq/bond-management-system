import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    // Check if department with same name already exists
    const existingDepartment = await this.prisma.departments.findFirst({
      where: {
        name: {
          equals: createDepartmentDto.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingDepartment) {
      throw new ConflictException(
        `Department with name ${createDepartmentDto.name} already exists`,
      );
    }

    return this.prisma.departments.create({
      data: createDepartmentDto,
    });
  }

  async findAll() {
    return this.prisma.departments.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            employees: true,
            bond_agreements: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.departments.findUnique({
      where: { id },
      include: {
        employees: {
          where: { is_active: true },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            position: true,
          },
          orderBy: { first_name: 'asc' },
        },
        bond_agreements: {
          include: {
            employees_bond_agreements_employee_idToemployees: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
            training_providers: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        _count: {
          select: {
            employees: true,
            bond_agreements: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async findByName(name: string) {
    return this.prisma.departments.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        is_active: true,
      },
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      // Check if name is being updated and if it already exists
      if (updateDepartmentDto.name) {
        const existingDepartment = await this.prisma.departments.findFirst({
          where: {
            name: {
              equals: updateDepartmentDto.name,
              mode: 'insensitive',
            },
            NOT: { id },
          },
        });

        if (existingDepartment) {
          throw new ConflictException(
            `Department with name ${updateDepartmentDto.name} already exists`,
          );
        }
      }

      return await this.prisma.departments.update({
        where: { id },
        data: updateDepartmentDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if department has employees
      const employees = await this.prisma.employees.findMany({
        where: { department_id: id },
        take: 1,
      });

      if (employees.length > 0) {
        throw new ConflictException(
          'Cannot delete department with associated employees',
        );
      }

      // Soft delete by setting is_active to false
      return await this.prisma.departments.update({
        where: { id },
        data: { is_active: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getDepartmentStats() {
    const departments = await this.prisma.departments.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            employees: true,
            bond_agreements: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
        bond_agreements: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            training_cost: true,
          },
        },
      },
    });

    return departments.map((dept) => {
      const totalExposure = dept.bond_agreements.reduce(
        (sum, bond) => sum + Number(bond.training_cost),
        0,
      );

      return {
        id: dept.id,
        name: dept.name,
        employee_count: dept._count.employees,
        active_bonds_count: dept._count.bond_agreements,
        total_exposure: totalExposure,
        average_exposure:
          dept._count.bond_agreements > 0
            ? totalExposure / dept._count.bond_agreements
            : 0,
      };
    });
  }
}
