import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max } from 'class-validator';

export class UpdateKeyDto {
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

  @IsInt()
  @Min(0)
  @IsOptional()
  usedCount?: number;

  @IsString()
  @IsOptional()
  usedBy?: string | null;
}
