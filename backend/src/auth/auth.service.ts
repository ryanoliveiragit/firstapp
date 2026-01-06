import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateKeyDto } from './dto/validate-key.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async validateKey(dto: ValidateKeyDto, onProgress?: (message: string) => void) {
    const { key } = dto;
    const startTime = Date.now();

    const sendMessage = (msg: string) => {
      if (onProgress) {
        onProgress(msg);
      }
      this.logger.debug(msg);
    };

    sendMessage('Analisando formato da chave...');
    await this.delay(300);

    // Normalizar a chave: remover hífens e espaços, converter para maiúsculas
    const normalizedKey = key.trim().replace(/[-\s]/g, '').toUpperCase();
    
    // Formatar a chave para buscar no banco (com hífens)
    const formattedKey = normalizedKey.match(/.{1,4}/g)?.join('-') || normalizedKey;

    this.logger.debug(`🔍 Chave recebida: ${key}`);
    this.logger.debug(`🔍 Chave normalizada (sem hífens): ${normalizedKey}`);
    this.logger.debug(`🔍 Chave formatada (com hífens): ${formattedKey}`);

    sendMessage('Conectando ao banco de dados...');
    await this.delay(400);
    
    try {
      sendMessage('Buscando chave no banco de dados...');
      await this.delay(500);
      
      // Busca a chave no banco de dados (tenta primeiro com hífens, depois sem)
      let licenseKey = await this.prisma.licenseKey.findUnique({
        where: { key: formattedKey },
      });

      this.logger.debug(`🔍 Busca com formato "${formattedKey}": ${licenseKey ? 'Encontrada' : 'Não encontrada'}`);

      // Se não encontrou com hífens, tenta sem hífens
      if (!licenseKey) {
        licenseKey = await this.prisma.licenseKey.findUnique({
          where: { key: normalizedKey },
        });
        this.logger.debug(`🔍 Busca sem hífens "${normalizedKey}": ${licenseKey ? 'Encontrada' : 'Não encontrada'}`);
      }

      // Se ainda não encontrou, tenta buscar todas as chaves e comparar (fallback)
      if (!licenseKey) {
        this.logger.debug('🔍 Tentando busca alternativa (comparando todas as chaves)...');
        const allKeys = await this.prisma.licenseKey.findMany({
          where: { isValid: true },
        });
        
        for (const dbKey of allKeys) {
          const dbKeyNormalized = dbKey.key.replace(/[-\s]/g, '').toUpperCase();
          if (dbKeyNormalized === normalizedKey) {
            licenseKey = dbKey;
            this.logger.debug(`✅ Chave encontrada via busca alternativa: ${dbKey.key}`);
            break;
          }
        }
      }

      if (!licenseKey) {
        sendMessage('Chave não encontrada no banco de dados');
        this.logger.warn(`⚠️ Chave não encontrada no banco de dados`);
        throw new UnauthorizedException('Chave de autenticação inválida');
      }

      sendMessage('Chave encontrada. Verificando status...');
      await this.delay(400);
      this.logger.debug(`📋 Chave encontrada - ID: ${licenseKey.id}, Válida: ${licenseKey.isValid}, Expira em: ${licenseKey.expiresAt || 'Nunca'}`);

      if (!licenseKey.isValid) {
        sendMessage('Chave desativada no sistema');
        this.logger.warn(`⚠️ Chave desativada - ID: ${licenseKey.id}`);
        throw new UnauthorizedException('Chave de autenticação desativada');
      }

      sendMessage('Verificando data de expiração...');
      await this.delay(300);

      // Verifica se a chave expirou
      if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
        sendMessage('Chave expirada');
        this.logger.warn(`⚠️ Chave expirada - ID: ${licenseKey.id}, Expirou em: ${licenseKey.expiresAt}`);
        throw new UnauthorizedException('Chave de autenticação expirada');
      }

      sendMessage('Verificando limite de uso...');
      await this.delay(300);

      // Verifica se a chave já foi usada (limite de 1 uso por pessoa)
      if (licenseKey.usedBy) {
        sendMessage('Chave já foi utilizada');
        this.logger.warn(`⚠️ Chave já utilizada - ID: ${licenseKey.id}, Usado por: ${licenseKey.usedBy}`);
        throw new UnauthorizedException('Esta chave já foi utilizada e não pode ser reutilizada');
      }

      // Verifica se atingiu o limite de usos
      if (licenseKey.usedCount >= licenseKey.maxUses) {
        sendMessage('Limite de usos atingido');
        this.logger.warn(`⚠️ Limite de usos atingido - ID: ${licenseKey.id}, Usos: ${licenseKey.usedCount}/${licenseKey.maxUses}`);
        throw new UnauthorizedException('Limite de usos desta chave foi atingido');
      }

      sendMessage('Atualizando registro de uso...');
      await this.delay(400);

      // Gera um ID único para o usuário (pode ser melhorado com identificação real)
      const generatedUserId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Atualiza o último uso e marca como usado
      const updatedKey = await this.prisma.licenseKey.update({
        where: { id: licenseKey.id },
        data: { 
          lastUsedAt: new Date(),
          usedCount: { increment: 1 },
          usedBy: generatedUserId,
        },
      });

      sendMessage('Validação concluída com sucesso!');
      const duration = Date.now() - startTime;
      this.logger.log(`✅ Validação concluída com sucesso em ${duration}ms - UserId: ${generatedUserId}`);

      return {
        valid: true,
        userId: updatedKey.userId || generatedUserId,
        message: 'Chave válida',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Erro na validação após ${duration}ms: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
