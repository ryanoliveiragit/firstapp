import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeyDto {
  @ApiProperty({
    description: 'Chave de licença (opcional, será gerada automaticamente se não fornecida)',
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
    default: true,
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
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxUses?: number;
}
