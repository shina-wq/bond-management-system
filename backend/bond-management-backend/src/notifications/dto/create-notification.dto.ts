import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  bond_id: string;

  @IsString()
  rule_id: string;

  @IsString()
  recipient_id: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  retry_count?: number;
}
