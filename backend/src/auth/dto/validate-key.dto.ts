import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ValidateKeyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  key: string;
}
