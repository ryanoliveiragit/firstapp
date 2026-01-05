# Guia de Solução de Problemas

## Erro de Permissão do PostgreSQL

Se você encontrar o erro:
```
Error: ERROR: permission denied to terminate process
DETAIL: Only roles with the SUPERUSER attribute may terminate processes of roles with the SUPERUSER attribute.
```

Isso acontece porque o Prisma tenta encerrar processos durante as migrações, o que requer privilégios de SUPERUSER.

### Soluções

#### Opção 1: Usar `prisma db push` (Recomendado para desenvolvimento)

O `db push` é mais simples e não requer permissões de SUPERUSER:

```bash
npx prisma db push
```

Isso criará/atualizará as tabelas diretamente sem criar arquivos de migração.

**Vantagens:**
- Não requer permissões de SUPERUSER
- Mais rápido para desenvolvimento
- Atualiza o schema diretamente

**Desvantagens:**
- Não cria histórico de migrações
- Não é recomendado para produção

#### Opção 2: Conceder permissões ao usuário do banco

Se você tem acesso ao PostgreSQL como superusuário:

```sql
-- Conectar como superusuário (postgres)
ALTER USER seu_usuario WITH SUPERUSER;
```

Ou conceder apenas as permissões necessárias:

```sql
-- Conceder permissões específicas
GRANT ALL PRIVILEGES ON DATABASE firstapp TO seu_usuario;
ALTER USER seu_usuario CREATEDB;
```

#### Opção 3: Usar um usuário com privilégios de SUPERUSER

Atualize sua `DATABASE_URL` no `.env`:

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/firstapp?schema=public"
```

**⚠️ Atenção:** Use apenas em desenvolvimento. Em produção, use um usuário com permissões mínimas necessárias.

#### Opção 4: Usar `prisma migrate deploy` (Produção)

Para produção, use `migrate deploy` que não tenta encerrar processos:

```bash
npx prisma migrate deploy
```

Mas primeiro você precisa criar as migrações com um usuário que tenha permissões.

### Configuração Recomendada para Desenvolvimento

1. Use `prisma db push` para desenvolvimento inicial
2. Quando estiver pronto, crie migrações com um usuário SUPERUSER
3. Em produção, use `prisma migrate deploy`

### Scripts Atualizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy"
  }
}
```

### Verificar Conexão

Teste a conexão com o banco:

```bash
npx prisma db pull
```

Se funcionar, o problema é apenas com as migrações.
