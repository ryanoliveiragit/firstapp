import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Função para gerar uma chave aleatória
function generateLicenseKey(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    key += chars[randomIndex];
  }
  
  // Formatar como XXXX-XXXX-XXXX-XXXX
  return key.match(/.{1,4}/g)?.join('-') || key;
}

// Função para gerar múltiplas chaves
async function generateKeys(count: number = 1, userId?: string, expiresInDays?: number) {
  console.log(`🔑 Gerando ${count} chave(s) de licença...\n`);

  const keys = [];

  for (let i = 0; i < count; i++) {
    let key: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Garantir que a chave seja única
    while (!isUnique && attempts < maxAttempts) {
      key = generateLicenseKey();
      const existing = await prisma.licenseKey.findUnique({
        where: { key },
      });

      if (!existing) {
        isUnique = true;
      } else {
        attempts++;
        console.log(`⚠️  Chave ${key} já existe, gerando nova...`);
      }
    }

    if (!isUnique) {
      console.error(`❌ Não foi possível gerar uma chave única após ${maxAttempts} tentativas`);
      continue;
    }

    // Calcular data de expiração se fornecida
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    try {
      const licenseKey = await prisma.licenseKey.create({
        data: {
          key: key!,
          isValid: true,
          userId: userId || null,
          expiresAt: expiresAt,
          maxUses: 1,
          usedCount: 0,
          usedBy: null,
        },
      });

      keys.push(licenseKey);
      console.log(`✅ Chave ${i + 1}/${count} criada:`);
      console.log(`   Key: ${licenseKey.key}`);
      console.log(`   ID: ${licenseKey.id}`);
      console.log(`   Válida: ${licenseKey.isValid}`);
      if (expiresAt) {
        console.log(`   Expira em: ${expiresAt.toLocaleDateString('pt-BR')}`);
      } else {
        console.log(`   Expira em: Nunca`);
      }
      console.log('');
    } catch (error) {
      console.error(`❌ Erro ao criar chave ${i + 1}:`, error);
    }
  }

  return keys;
}

async function main() {
  const args = process.argv.slice(2);
  
  // Parse argumentos
  let count = 1;
  let userId: string | undefined;
  let expiresInDays: number | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--count' || arg === '-c') {
      count = parseInt(args[i + 1]) || 1;
      i++;
    } else if (arg === '--user' || arg === '-u') {
      userId = args[i + 1];
      i++;
    } else if (arg === '--expires' || arg === '-e') {
      expiresInDays = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
🔑 Gerador de Chaves de Licença

Uso:
  npm run generate:key [opções]

Opções:
  --count, -c <número>     Número de chaves a gerar (padrão: 1)
  --user, -u <id>          ID do usuário associado (opcional)
  --expires, -e <dias>     Dias até expirar (opcional, padrão: nunca expira)
  --help, -h               Mostra esta ajuda

Exemplos:
  npm run generate:key
  npm run generate:key --count 5
  npm run generate:key --count 1 --user "user-123"
  npm run generate:key --count 3 --expires 30
  npm run generate:key --count 1 --user "user-123" --expires 90
      `);
      process.exit(0);
    }
  }

  try {
    const keys = await generateKeys(count, userId, expiresInDays);
    
    console.log(`\n✨ ${keys.length} chave(s) gerada(s) com sucesso!`);
    console.log('\n📋 Resumo:');
    keys.forEach((key, index) => {
      console.log(`   ${index + 1}. ${key.key}`);
    });
  } catch (error) {
    console.error('❌ Erro ao gerar chaves:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
