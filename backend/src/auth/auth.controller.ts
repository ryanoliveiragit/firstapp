import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateKeyDto } from './dto/validate-key.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateKey(@Body() dto: ValidateKeyDto) {
    this.logger.log(`🔐 Requisição de validação recebida - Key: ${this.maskKey(dto.key)}`);
    this.logger.debug(`📥 Dados recebidos: ${JSON.stringify({ key: this.maskKey(dto.key), length: dto.key.length })}`);

    try {
      const result = await this.authService.validateKey(dto);
      this.logger.log(`✅ Chave validada com sucesso - UserId: ${result.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Erro ao validar chave: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      if (error instanceof Error) {
        return {
          valid: false,
          message: error.message,
        };
      }
      return {
        valid: false,
        message: 'Erro ao validar chave',
      };
    }
  }

  private maskKey(key: string): string {
    if (!key || key.length < 4) return '****';
    return `${key.substring(0, 2)}${'*'.repeat(key.length - 4)}${key.substring(key.length - 2)}`;
  }
}
