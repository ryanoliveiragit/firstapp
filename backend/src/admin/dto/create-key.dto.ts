import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max } from 'class-validator';

export class CreateKeyDto {
  @IsString()
  @IsOptional()
  key?: string;

  @IsBoolean()
  @IsOptional()
  isValid?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxUses?: number;
}
