import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateKeyDto {
  @ApiProperty({
    description: 'Chave de licença para validação',
    example: 'ABCD-1234-EFGH-5678',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  key: string;
}
