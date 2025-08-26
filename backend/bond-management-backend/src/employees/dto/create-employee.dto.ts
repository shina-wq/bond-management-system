import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  employee_id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsString()
  department: string;

  @IsString()
  position: string;

  @IsDateString()
  hire_date: string;

  @IsOptional()
  @IsString()
  supervisor_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
