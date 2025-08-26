import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingProviderDto } from './create-training_provider.dto';

export class UpdateTrainingProviderDto extends PartialType(CreateTrainingProviderDto) {}
