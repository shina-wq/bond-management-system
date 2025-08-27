import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationRuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  days_before_event: number;

  @IsString()
  template_subject: string;

  @IsString()
  template_body: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
