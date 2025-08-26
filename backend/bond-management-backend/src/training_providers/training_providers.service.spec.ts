import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProvidersService } from './training_providers.service';

describe('TrainingProvidersService', () => {
  let service: TrainingProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingProvidersService],
    }).compile();

    service = module.get<TrainingProvidersService>(TrainingProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
