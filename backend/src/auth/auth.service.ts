import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateKeyDto } from './dto/validate-key.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async validateKey(dto: ValidateKeyDto) {
    const { key } = dto;
    const startTime = Date.now();

    this.logger.debug(`🔍 Buscando chave no banco de dados...`);
    
    try {
      // Busca a chave no banco de dados
      const licenseKey = await this.prisma.licenseKey.findUnique({
        where: { key },
      });

      if (!licenseKey) {
        this.logger.warn(`⚠️ Chave não encontrada no banco de dados`);
        throw new UnauthorizedException('Chave de autenticação inválida');
      }

      this.logger.debug(`📋 Chave encontrada - ID: ${licenseKey.id}, Válida: ${licenseKey.isValid}, Expira em: ${licenseKey.expiresAt || 'Nunca'}`);

      if (!licenseKey.isValid) {
        this.logger.warn(`⚠️ Chave desativada - ID: ${licenseKey.id}`);
        throw new UnauthorizedException('Chave de autenticação desativada');
      }

      // Verifica se a chave expirou
      if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
        this.logger.warn(`⚠️ Chave expirada - ID: ${licenseKey.id}, Expirou em: ${licenseKey.expiresAt}`);
        throw new UnauthorizedException('Chave de autenticação expirada');
      }

      // Atualiza o último uso
      this.logger.debug(`🔄 Atualizando último uso da chave...`);
      await this.prisma.licenseKey.update({
        where: { id: licenseKey.id },
        data: { lastUsedAt: new Date() },
      });

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Validação concluída com sucesso em ${duration}ms - UserId: ${licenseKey.userId || licenseKey.id}`);

      return {
        valid: true,
        userId: licenseKey.userId || licenseKey.id,
        message: 'Chave válida',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Erro na validação após ${duration}ms: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }
}
