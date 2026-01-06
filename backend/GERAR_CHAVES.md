# 🔑 Como Gerar Novas Chaves de Licença

Este guia explica como gerar novas chaves de licença para o sistema.

## 📋 Pré-requisitos

- Banco de dados PostgreSQL configurado e rodando
- Prisma configurado (execute `npm run prisma:push` primeiro)
- Dependências instaladas (`npm install`)

## 🚀 Gerar uma Chave

### Gerar uma única chave

```bash
cd backend
npm run generate:key
```

Isso criará uma chave aleatória no formato `XXXX-XXXX-XXXX-XXXX` e a salvará no banco de dados.

### Gerar múltiplas chaves

```bash
npm run generate:key --count 5
```

Isso gerará 5 chaves de uma vez.

### Gerar chave com usuário associado

```bash
npm run generate:key --user "user-123"
```

Isso criará uma chave associada a um usuário específico.

### Gerar chave com data de expiração

```bash
npm run generate:key --expires 30
```

Isso criará uma chave que expira em 30 dias.

### Gerar chave completa (com usuário e expiração)

```bash
npm run generate:key --count 1 --user "user-123" --expires 90
```

## 📝 Opções Disponíveis

| Opção | Abreviação | Descrição | Exemplo |
|-------|------------|-----------|---------|
| `--count` | `-c` | Número de chaves a gerar | `--count 5` |
| `--user` | `-u` | ID do usuário associado | `--user "user-123"` |
| `--expires` | `-e` | Dias até expirar | `--expires 30` |
| `--help` | `-h` | Mostra ajuda | `--help` |

## 🔍 Verificar Chaves Geradas

### Usando Prisma Studio

```bash
npm run prisma:studio
```

Isso abrirá uma interface visual onde você pode ver todas as chaves no banco de dados.

### Usando SQL

```sql
SELECT * FROM license_keys ORDER BY "createdAt" DESC;
```

## 📊 Formato das Chaves

As chaves são geradas no formato:
- **Formato**: `XXXX-XXXX-XXXX-XXXX`
- **Caracteres**: A-Z e 0-9 (apenas maiúsculas)
- **Comprimento**: 16 caracteres (sem hífens)
- **Exemplo**: `A1B2-C3D4-E5F6-G7H8`

## ⚠️ Importante

1. **Unicidade**: O script garante que cada chave seja única no banco de dados
2. **Segurança**: As chaves são geradas usando `crypto.randomInt()` para máxima segurança
3. **Validação**: Todas as chaves são criadas como válidas (`isValid: true`) por padrão
4. **Expiração**: Se não especificar `--expires`, a chave nunca expira

## 🧪 Exemplo de Uso Completo

```bash
# 1. Gerar 3 chaves de teste
npm run generate:key --count 3

# 2. Verificar no Prisma Studio
npm run prisma:studio

# 3. Testar uma das chaves no frontend
# Use a chave gerada no campo de login
```

## 🔄 Atualizar Chave Existente

Se você precisar atualizar uma chave existente (por exemplo, desativar ou alterar expiração), use o Prisma Studio ou SQL:

```sql
-- Desativar uma chave
UPDATE license_keys SET "isValid" = false WHERE key = 'SUA-CHAVE-AQUI';

-- Alterar data de expiração
UPDATE license_keys SET "expiresAt" = '2024-12-31' WHERE key = 'SUA-CHAVE-AQUI';
```

## 📚 Scripts Relacionados

- `npm run seed:key` - Cria a chave de exemplo `TEST-KEY-123456`
- `npm run generate:key` - Gera novas chaves personalizadas
- `npm run prisma:studio` - Visualiza e edita dados no banco
