# Chave de Exemplo para Testes

## 🔑 Chave de Teste

A chave de exemplo criada pelo script de seed é:

```
TEST-KEY-123456
```

## 📝 Como Criar a Chave no Banco

### Opção 1: Usar o Script de Seed (Recomendado)

```bash
cd backend
npm run seed:key
```

Isso criará automaticamente a chave `TEST-KEY-123456` no banco de dados.

### Opção 2: Usar Prisma Studio

```bash
cd backend
npm run prisma:studio
```

1. Abra o Prisma Studio no navegador
2. Clique em "Add record" na tabela `LicenseKey`
3. Preencha os campos:
   - `key`: `TEST-KEY-123456`
   - `isValid`: `true`
   - `userId`: (opcional) `user-example-123`
   - `expiresAt`: (opcional, deixe vazio para não expirar)

### Opção 3: SQL Direto

Execute no PostgreSQL:

```sql
INSERT INTO license_keys (id, key, "isValid", "userId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'TEST-KEY-123456',
  true,
  'user-example-123',
  NOW(),
  NOW()
);
```

## ✅ Verificar se a Chave Foi Criada

```bash
cd backend
npm run prisma:studio
```

Ou execute uma query SQL:

```sql
SELECT * FROM license_keys WHERE key = 'TEST-KEY-123456';
```

## 🧪 Testar a Validação

1. Inicie o backend:
   ```bash
   cd backend
   npm run start:dev
   ```

2. No frontend, use a chave: `TEST-KEY-123456`

3. Verifique os logs no console do backend para ver o processo de validação.

## 📋 Outras Chaves de Teste

Você pode criar outras chaves manualmente usando qualquer um dos métodos acima. Exemplos:

- `DEMO-KEY-789012`
- `DEV-KEY-345678`
- `TEST-2024-ABCDEF`

## ⚠️ Importante

- A chave deve ser única no banco de dados
- Remova hífens e espaços antes de salvar (o frontend faz isso automaticamente)
- Para produção, use chaves mais seguras e complexas
