import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ValidateKeyDto } from './dto/validate-key.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Validar chave de licença',
    description: 'Valida uma chave de licença e retorna informações do usuário se válida. Retorna resposta JSON simples.'
  })
  @ApiBody({ type: ValidateKeyDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Chave validada com sucesso',
    schema: {
      example: {
        valid: true,
        userId: 'user-123',
        key: 'XXXX-XXXX-XXXX-XXXX',
        message: 'Chave válida'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chave inválida',
    schema: {
      example: {
        valid: false,
        message: 'Chave inválida ou expirada'
      }
    }
  })
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

  @Post('validate-stream')
  @ApiOperation({ 
    summary: 'Validar chave de licença (com streaming)',
    description: 'Valida uma chave de licença usando Server-Sent Events (SSE) para retornar mensagens progressivas. Retorna eventos no formato text/event-stream. Recomendado para web/dev, não funciona bem no Tauri.'
  })
  @ApiBody({ type: ValidateKeyDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Stream de eventos SSE',
    headers: {
      'Content-Type': { description: 'text/event-stream' },
      'Cache-Control': { description: 'no-cache' },
      'Connection': { description: 'keep-alive' }
    }
  })
  async validateKeyStream(@Body() dto: ValidateKeyDto, @Res() res: Response) {
    this.logger.log(`🔐 Requisição de validação com stream recebida - Key: ${this.maskKey(dto.key)}`);
    this.logger.debug(`📥 Chave recebida (completa): ${dto.key}`);
    this.logger.debug(`📥 Tamanho da chave: ${dto.key.length} caracteres`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const onProgress = (message: string) => {
        sendEvent({ type: 'progress', message });
      };

      const result = await this.authService.validateKey(dto, onProgress);
      sendEvent({ type: 'success', result });
      res.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao validar chave';
      sendEvent({ type: 'error', message: errorMessage });
      res.end();
    }
  }

  private maskKey(key: string): string {
    if (!key || key.length < 4) return '****';
    return `${key.substring(0, 2)}${'*'.repeat(key.length - 4)}${key.substring(key.length - 2)}`;
  }
}
