import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProvidersController } from './training_providers.controller';
import { TrainingProvidersService } from './training_providers.service';

describe('TrainingProvidersController', () => {
  let controller: TrainingProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingProvidersController],
      providers: [TrainingProvidersService],
    }).compile();

    controller = module.get<TrainingProvidersController>(TrainingProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
