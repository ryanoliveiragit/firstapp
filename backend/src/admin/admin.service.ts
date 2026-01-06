import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  // Gerar uma chave aleatória
  private generateLicenseKey(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      key += chars[randomIndex];
    }
    
    // Formatar como XXXX-XXXX-XXXX-XXXX
    return key.match(/.{1,4}/g)?.join('-') || key;
  }

  // Criar nova chave
  async createKey(dto: CreateKeyDto) {
    let key = dto.key;

    // Se não forneceu chave, gerar uma
    if (!key) {
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        key = this.generateLicenseKey();
        const existing = await this.prisma.licenseKey.findUnique({
          where: { key },
        });

        if (!existing) {
          isUnique = true;
        } else {
          attempts++;
        }
      }

      if (!isUnique) {
        throw new ConflictException('Não foi possível gerar uma chave única');
      }
    } else {
      // Verificar se a chave já existe
      const existing = await this.prisma.licenseKey.findUnique({
        where: { key },
      });

      if (existing) {
        throw new ConflictException('Chave já existe no banco de dados');
      }
    }

    // Normalizar a chave
    const normalizedKey = key.replace(/[-\s]/g, '').toUpperCase();
    const formattedKey = normalizedKey.match(/.{1,4}/g)?.join('-') || normalizedKey;

    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;

    const licenseKey = await this.prisma.licenseKey.create({
      data: {
        key: formattedKey,
        isValid: dto.isValid ?? true,
        userId: dto.userId || null,
        expiresAt: expiresAt,
        maxUses: dto.maxUses ?? 1,
        usedCount: 0,
        usedBy: null,
      },
    });

    this.logger.log(`✅ Chave criada: ${licenseKey.key} (ID: ${licenseKey.id})`);

    return licenseKey;
  }

  // Listar todas as chaves
  async findAll() {
    return this.prisma.licenseKey.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Buscar chave por ID
  async findOne(id: string) {
    const licenseKey = await this.prisma.licenseKey.findUnique({
      where: { id },
    });

    if (!licenseKey) {
      throw new NotFoundException('Chave não encontrada');
    }

    return licenseKey;
  }

  // Buscar chave por chave (key)
  async findByKey(key: string) {
    const normalizedKey = key.replace(/[-\s]/g, '').toUpperCase();
    const formattedKey = normalizedKey.match(/.{1,4}/g)?.join('-') || normalizedKey;

    const licenseKey = await this.prisma.licenseKey.findUnique({
      where: { key: formattedKey },
    });

    if (!licenseKey) {
      // Tentar sem hífens
      const licenseKeyWithoutHyphens = await this.prisma.licenseKey.findUnique({
        where: { key: normalizedKey },
      });

      if (!licenseKeyWithoutHyphens) {
        throw new NotFoundException('Chave não encontrada');
      }

      return licenseKeyWithoutHyphens;
    }

    return licenseKey;
  }

  // Atualizar chave
  async update(id: string, dto: UpdateKeyDto) {
    const existing = await this.prisma.licenseKey.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Chave não encontrada');
    }

    // Se está atualizando a chave, verificar se não existe outra com o mesmo valor
    if (dto.key && dto.key !== existing.key) {
      const normalizedKey = dto.key.replace(/[-\s]/g, '').toUpperCase();
      const formattedKey = normalizedKey.match(/.{1,4}/g)?.join('-') || normalizedKey;

      const keyExists = await this.prisma.licenseKey.findUnique({
        where: { key: formattedKey },
      });

      if (keyExists && keyExists.id !== id) {
        throw new ConflictException('Já existe outra chave com este valor');
      }
    }

    const updateData: any = {};

    if (dto.key !== undefined) {
      const normalizedKey = dto.key.replace(/[-\s]/g, '').toUpperCase();
      updateData.key = normalizedKey.match(/.{1,4}/g)?.join('-') || normalizedKey;
    }

    if (dto.isValid !== undefined) updateData.isValid = dto.isValid;
    if (dto.userId !== undefined) updateData.userId = dto.userId;
    if (dto.expiresAt !== undefined) {
      updateData.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }
    if (dto.maxUses !== undefined) updateData.maxUses = dto.maxUses;
    if (dto.usedCount !== undefined) updateData.usedCount = dto.usedCount;
    if (dto.usedBy !== undefined) updateData.usedBy = dto.usedBy;

    const updated = await this.prisma.licenseKey.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`✅ Chave atualizada: ${updated.key} (ID: ${updated.id})`);

    return updated;
  }

  // Deletar chave
  async remove(id: string) {
    const existing = await this.prisma.licenseKey.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Chave não encontrada');
    }

    await this.prisma.licenseKey.delete({
      where: { id },
    });

    this.logger.log(`✅ Chave deletada: ${existing.key} (ID: ${existing.id})`);

    return { message: 'Chave deletada com sucesso', key: existing.key };
  }

  // Resetar uso da chave (permitir reutilização)
  async resetUsage(id: string) {
    const existing = await this.prisma.licenseKey.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Chave não encontrada');
    }

    const updated = await this.prisma.licenseKey.update({
      where: { id },
      data: {
        usedCount: 0,
        usedBy: null,
        lastUsedAt: null,
      },
    });

    this.logger.log(`✅ Uso da chave resetado: ${updated.key} (ID: ${updated.id})`);

    return updated;
  }
}
