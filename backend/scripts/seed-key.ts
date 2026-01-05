import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inserindo chave de exemplo...');

  // Chave de exemplo: TEST-KEY-123456
  const exampleKey = 'TEST-KEY-123456';

  try {
    // Verifica se a chave já existe
    const existing = await prisma.licenseKey.findUnique({
      where: { key: exampleKey },
    });

    if (existing) {
      console.log('✅ Chave já existe no banco de dados');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Válida: ${existing.isValid}`);
      console.log(`   Criada em: ${existing.createdAt}`);
      return;
    }

    // Cria a chave de exemplo
    const licenseKey = await prisma.licenseKey.create({
      data: {
        key: exampleKey,
        isValid: true,
        userId: 'user-example-123',
        // Não expira (expiresAt: null)
      },
    });

    console.log('✅ Chave de exemplo criada com sucesso!');
    console.log(`   ID: ${licenseKey.id}`);
    console.log(`   Key: ${licenseKey.key}`);
    console.log(`   Válida: ${licenseKey.isValid}`);
    console.log('');
    console.log('🔑 Use esta chave para testar:');
    console.log(`   ${exampleKey}`);
  } catch (error) {
    console.error('❌ Erro ao criar chave:', error);
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
