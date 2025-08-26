import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  providers_id: string;

  @IsString()
  training_name: string;

  @IsOptional()
  @IsString()
  training_description?: string;

  @IsOptional()
  @IsNumber()
  training_duration_months?: number;

  @IsOptional()
  @IsNumber()
  training_cost?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
