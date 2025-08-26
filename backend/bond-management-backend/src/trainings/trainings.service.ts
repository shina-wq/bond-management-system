import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingsService {
  constructor(private prisma: PrismaService) {}

  async create(createTrainingDto: CreateTrainingDto) {
    // Verify training provider exists
    const trainingProvider = await this.prisma.training_providers.findUnique({
      where: { id: createTrainingDto.providers_id },
    });

    if (!trainingProvider) {
      throw new NotFoundException(
        `Training provider with ID ${createTrainingDto.providers_id} not found`,
      );
    }

    // Check if training with same name already exists for this provider
    const existingTraining = await this.prisma.trainings.findFirst({
      where: {
        training_name: createTrainingDto.training_name,
        providers_id: createTrainingDto.providers_id,
      },
    });

    if (existingTraining) {
      throw new ConflictException(
        `Training with name ${createTrainingDto.training_name} already exists for this provider`,
      );
    }

    return this.prisma.trainings.create({
      data: createTrainingDto,
      include: {
        training_providers: true,
      },
    });
  }

  async findAll() {
    return this.prisma.trainings.findMany({
      include: {
        training_providers: true,
      },
      orderBy: { training_name: 'asc' },
    });
  }

  async findOne(id: string) {
    const training = await this.prisma.trainings.findUnique({
      where: { id },
      include: {
        training_providers: true,
      },
    });

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    return training;
  }

  async findByProvider(providerId: string) {
    const provider = await this.prisma.training_providers.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException(
        `Training provider with ID ${providerId} not found`,
      );
    }

    return this.prisma.trainings.findMany({
      where: { providers_id: providerId },
      include: {
        training_providers: true,
      },
      orderBy: { training_name: 'asc' },
    });
  }

  async update(id: string, updateTrainingDto: UpdateTrainingDto) {
    try {
      return await this.prisma.trainings.update({
        where: { id },
        data: updateTrainingDto,
        include: {
          training_providers: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Training with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.trainings.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Training with ID ${id} not found`);
      }
      throw error;
    }
  }
}
