import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Listando todas as chaves no banco de dados...\n');

  try {
    const keys = await prisma.licenseKey.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (keys.length === 0) {
      console.log('❌ Nenhuma chave encontrada no banco de dados.');
      return;
    }

    console.log(`✅ Encontradas ${keys.length} chave(s):\n`);

    keys.forEach((key, index) => {
      console.log(`${index + 1}. Chave: ${key.key}`);
      console.log(`   ID: ${key.id}`);
      console.log(`   Válida: ${key.isValid}`);
      console.log(`   Criada em: ${key.createdAt.toLocaleString('pt-BR')}`);
      if (key.expiresAt) {
        console.log(`   Expira em: ${key.expiresAt.toLocaleString('pt-BR')}`);
      } else {
        console.log(`   Expira em: Nunca`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao listar chaves:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
