# Backend NestJS com Prisma

Backend robusto e moderno para validação de chaves de autenticação.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **Prisma** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/firstapp?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:1420
```

3. Configure o Prisma:
```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Criar as tabelas no banco (quando o banco estiver configurado)
# Use db push para desenvolvimento (não requer permissões de SUPERUSER)
npm run prisma:push

# OU use migrate para criar histórico de migrações (requer permissões)
npm run prisma:migrate
```

**Nota:** Se encontrar erros de permissão, use `prisma:push` em vez de `prisma:migrate`. Veja `TROUBLESHOOTING.md` para mais detalhes.

4. Criar chave de exemplo:
```bash
npm run seed:key
```

Isso criará a chave `TEST-KEY-123456` no banco. Veja `CHAVE_EXEMPLO.md` para mais detalhes.

## 🏃 Executando

### Desenvolvimento
```bash
npm run start:dev
```

O backend estará disponível em `http://localhost:3000`

### Produção
```bash
npm run build
npm run start:prod
```

## 📡 Endpoints

### POST /api/auth/validate
Valida uma chave de autenticação.

**Request:**
```json
{
  "key": "TEST-KEY-123456"
}
```

**Response (sucesso):**
```json
{
  "valid": true,
  "userId": "uuid-do-usuario",
  "message": "Chave válida"
}
```

**Response (erro):**
```json
{
  "valid": false,
  "message": "Chave de autenticação inválida"
}
```

## 🗄️ Banco de Dados

O Prisma está configurado para usar PostgreSQL. Quando você configurar o banco de dados, execute:

```bash
# Opção 1: db push (recomendado para desenvolvimento, não requer SUPERUSER)
npm run prisma:push

# Opção 2: migrate (cria histórico, requer permissões de SUPERUSER)
npm run prisma:migrate
```

Isso criará a tabela `license_keys` no banco de dados.

**Problemas de permissão?** Veja `TROUBLESHOOTING.md` para soluções.

## 🔑 Chave de Exemplo

Após criar as tabelas, execute:

```bash
npm run seed:key
```

Isso criará a chave `TEST-KEY-123456` que você pode usar para testar.

Veja `CHAVE_EXEMPLO.md` para mais informações sobre chaves de teste.

## 📊 Logs

O backend possui logs detalhados para debug:

- ✅ Logs de sucesso
- ⚠️ Logs de aviso
- ❌ Logs de erro
- 🔍 Logs de debug

Todos os logs incluem informações sobre:
- Requisições recebidas
- Validações realizadas
- Erros encontrados
- Tempo de processamento

## 📝 Notas

- O banco de dados será configurado posteriormente pelo usuário
- Por enquanto, o backend está pronto para validar chaves quando o banco estiver configurado
- Você pode usar o Prisma Studio para visualizar os dados: `npm run prisma:studio`
- A rota correta da API é: `POST http://localhost:3000/api/auth/validate`