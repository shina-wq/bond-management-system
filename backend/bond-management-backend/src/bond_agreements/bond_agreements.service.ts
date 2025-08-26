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
        employee: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            department: true,
          },
        },
        training_provider: true,
        creator: { select: { first_name: true, last_name: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.bond_agreements.findMany({
      include: {
        employee: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            department: true,
          },
        },
        training_provider: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const bond = await this.prisma.bond_agreements.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            department: true,
            position: true,
          },
        },
        training_provider: true,
        creator: { select: { first_name: true, last_name: true } },
        status_history: {
          include: {
            changed_by_employee: {
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
          employee: {
            select: { first_name: true, last_name: true, email: true },
          },
          training_provider: true,
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
}
