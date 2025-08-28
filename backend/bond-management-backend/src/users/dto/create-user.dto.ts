import {
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
