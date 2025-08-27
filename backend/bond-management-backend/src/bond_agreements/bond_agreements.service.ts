import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBondAgreementDto } from './dto/create-bond_agreement.dto';
import { UpdateBondAgreementDto } from './dto/update-bond_agreement.dto';

@Injectable()
export class BondsAgreementService {
  constructor(private prisma: PrismaService) {}

  async create(createBondDto: CreateBondAgreementDto) {
    // Verify all foreign keys exist
    const [employee, trainingProvider, creator] = await Promise.all([
      this.prisma.employees.findUnique({
        where: { id: createBondDto.employee_id },
      }),
      this.prisma.training_providers.findUnique({
        where: { id: createBondDto.training_provider_id },
      }),
      this.prisma.employees.findUnique({
        where: { id: createBondDto.created_by },
      }),
    ]);

    if (!employee)
      throw new NotFoundException(
        `Employee ${createBondDto.employee_id} not found`,
      );
    if (!trainingProvider)
      throw new NotFoundException(
        `Training provider ${createBondDto.training_provider_id} not found`,
      );
    if (!creator)
      throw new NotFoundException(
        `Creator ${createBondDto.created_by} not found`,
      );

    return this.prisma.bond_agreements.create({
      data: createBondDto,
      include: {
        employees_bond_agreements_employee_idToemployees: {
          include: {
            departments: true,
          },
        },
        employees_bond_agreements_created_byToemployees: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        training_providers: true,
      },
    });
  }

  async findAll() {
    return this.prisma.bond_agreements.findMany({
      include: {
        employees_bond_agreements_employee_idToemployees: {
          include: {
            departments: true,
          },
        },
        training_providers: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const bond = await this.prisma.bond_agreements.findUnique({
      where: { id },
      include: {
        employees_bond_agreements_employee_idToemployees: {
          include: {
            departments: true,
          },
        },
        employees_bond_agreements_created_byToemployees: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        training_providers: true,
        bond_status_history: {
          include: {
            employees: {
              select: { first_name: true, last_name: true },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });
    if (!bond) throw new NotFoundException(`Bond ${id} not found`);
    return bond;
  }

  async update(id: string, updateBondDto: UpdateBondAgreementDto) {
    try {
      return await this.prisma.bond_agreements.update({
        where: { id },
        data: updateBondDto,
        include: {
          employees_bond_agreements_employee_idToemployees: {
            include: {
              departments: true,
            },
          },
          training_providers: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Bond ${id} not found`);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.bond_agreements.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException(`Bond ${id} not found`);
      throw error;
    }
  }

  async getFinancialExposureByDepartment() {
    const bonds = await this.prisma.bond_agreements.findMany({
      where: { status: 'ACTIVE' },
      include: {
        employees_bond_agreements_employee_idToemployees: {
          include: {
            departments: true,
          },
        },
      },
    });

    const departmentStats = bonds.reduce((acc, bond) => {
      // Access the included relation
      const employee = (bond as any)
        .employees_bond_agreements_employee_idToemployees;
      const departmentName = employee?.departments?.name || 'No Department';
      const departmentId = employee?.departments?.id;

      if (!acc[departmentName]) {
        acc[departmentName] = {
          department_id: departmentId,
          department_name: departmentName,
          total_exposure: 0,
          bond_count: 0,
        };
      }

      acc[departmentName].total_exposure += Number(bond.training_cost);
      acc[departmentName].bond_count += 1;

      return acc;
    }, {});

    return Object.values(departmentStats).sort(
      (a: any, b: any) => b.total_exposure - a.total_exposure,
    );
  }
}
