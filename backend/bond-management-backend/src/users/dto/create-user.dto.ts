import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  employee_id: string;

  @IsString()
  username: string;

  @IsString()
  password_hash: string;

  @IsString()
  role_id: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
