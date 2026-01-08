import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateKeyDto {
  @ApiProperty({
    description: 'Chave de licença',
    example: 'ABCD-1234-EFGH-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: 'Se a chave está válida',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isValid?: boolean;

  @ApiProperty({
    description: 'ID do usuário associado à chave',
    example: 'user-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Data de expiração da chave (ISO 8601)',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({
    description: 'Número máximo de usos permitidos',
    example: 1,
    minimum: 1,
    maximum: 1000,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxUses?: number;

  @ApiProperty({
    description: 'Contador de usos da chave',
    example: 0,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  usedCount?: number;

  @ApiProperty({
    description: 'ID do usuário que usou a chave',
    example: 'user-123',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  usedBy?: string | null;
}
