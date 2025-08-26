import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrainingProviderDto } from './dto/create-training_provider.dto';
import { UpdateTrainingProviderDto } from './dto/update-training_provider.dto';

@Injectable()
export class TrainingProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(createTrainingProviderDto: CreateTrainingProviderDto) {
    // Check if provider with same name already exists
    const existingProvider = await this.prisma.training_providers.findFirst({
      where: {
        name: {
          equals: createTrainingProviderDto.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingProvider) {
      throw new ConflictException(
        `Training provider with name ${createTrainingProviderDto.name} already exists`,
      );
    }

    return this.prisma.training_providers.create({
      data: createTrainingProviderDto,
    });
  }

  async findAll() {
    return this.prisma.training_providers.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const provider = await this.prisma.training_providers.findUnique({
      where: { id },
      include: {
        bond_agreements: {
          include: {
            employee: {
              select: {
                first_name: true,
                last_name: true,
                department: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        trainings: true,
      },
    });

    if (!provider) {
      throw new NotFoundException(`Training provider with ID ${id} not found`);
    }

    return provider;
  }

  async findByName(name: string) {
    return this.prisma.training_providers.findMany({
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
    updateTrainingProviderDto: UpdateTrainingProviderDto,
  ) {
    try {
      return await this.prisma.training_providers.update({
        where: { id },
        data: updateTrainingProviderDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Training provider with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if provider has associated bonds
      const bonds = await this.prisma.bond_agreements.findMany({
        where: { training_provider_id: id },
        take: 1,
      });

      if (bonds.length > 0) {
        throw new ConflictException(
          'Cannot delete training provider with associated bonds',
        );
      }

      return await this.prisma.training_providers.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Training provider with ID ${id} not found`,
        );
      }
      throw error;
    }
  }
}
