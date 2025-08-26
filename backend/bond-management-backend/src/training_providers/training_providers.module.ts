import { Module } from '@nestjs/common';
import { TrainingProvidersService } from './training_providers.service';
import { TrainingProvidersController } from './training_providers.controller';

@Module({
  controllers: [TrainingProvidersController],
  providers: [TrainingProvidersService],
})
export class TrainingProvidersModule {}
