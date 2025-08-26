import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateBondAgreementDto {
  @IsString()
  employee_id: string;

  @IsString()
  training_provider_id: string;

  @IsString()
  training_name: string;

  @IsOptional()
  @IsString()
  training_description?: string;

  @IsNumber()
  training_cost: number;

  @IsDateString()
  training_start_date: string;

  @IsDateString()
  training_end_date: string;

  @IsNumber()
  bond_duration_months: number;

  @IsDateString()
  bond_start_date: string;

  @IsOptional()
  @IsString()
  document_path?: string;

  @IsOptional()
  @IsString()
  document_hash?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  created_by: string;
}
