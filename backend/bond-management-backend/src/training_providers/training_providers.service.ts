import { Injectable } from '@nestjs/common';
import { CreateTrainingProviderDto } from './dto/create-training_provider.dto';
import { UpdateTrainingProviderDto } from './dto/update-training_provider.dto';

@Injectable()
export class TrainingProvidersService {
  create(createTrainingProviderDto: CreateTrainingProviderDto) {
    return 'This action adds a new trainingProvider';
  }

  findAll() {
    return `This action returns all trainingProviders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingProvider`;
  }

  update(id: number, updateTrainingProviderDto: UpdateTrainingProviderDto) {
    return `This action updates a #${id} trainingProvider`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingProvider`;
  }
}
