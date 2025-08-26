import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateTrainingProviderDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
