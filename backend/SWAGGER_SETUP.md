# 📚 Configuração do Swagger/OpenAPI

## ✅ O Que Foi Configurado

### 1. Dependências Instaladas
- `@nestjs/swagger` - Biblioteca oficial do NestJS para documentação Swagger/OpenAPI

### 2. Configuração no `main.ts`
- Swagger configurado e disponível em `/api/docs`
- Documentação com título, descrição e tags
- Servidores configurados (desenvolvimento e produção)

### 3. Decorators Adicionados

#### Controllers:
- `@ApiTags()` - Organiza endpoints por tags
- `@ApiOperation()` - Descrição de cada endpoint
- `@ApiResponse()` - Documenta respostas possíveis
- `@ApiParam()` - Documenta parâmetros de rota
- `@ApiBody()` - Documenta corpo da requisição

#### DTOs:
- `@ApiProperty()` - Documenta propriedades dos DTOs com exemplos e validações

## 🚀 Como Acessar

### Desenvolvimento
```
http://localhost:3000/api/docs
```

### Produção
```
https://firstapp-3y74.onrender.com/api/docs
```

## 📝 Endpoints Documentados

### Autenticação (`/api/auth`)
- ✅ `POST /api/auth/validate` - Validação de chave (JSON)
- ✅ `POST /api/auth/validate-stream` - Validação de chave (SSE)

### Administração (`/api/admin/keys`)
- ✅ `POST /api/admin/keys` - Criar chave
- ✅ `GET /api/admin/keys` - Listar todas as chaves
- ✅ `GET /api/admin/keys/:id` - Buscar por ID
- ✅ `GET /api/admin/keys/key/:key` - Buscar por valor da chave
- ✅ `PATCH /api/admin/keys/:id` - Atualizar chave
- ✅ `DELETE /api/admin/keys/:id` - Deletar chave
- ✅ `POST /api/admin/keys/:id/reset` - Resetar uso

## 🧪 Como Testar

1. **Inicie o servidor:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Acesse a documentação:**
   - Abra http://localhost:3000/api/docs

3. **Teste um endpoint:**
   - Clique em um endpoint para expandir
   - Clique em "Try it out"
   - Preencha os dados necessários
   - Clique em "Execute"
   - Veja a resposta

## 📄 Documentação Adicional

Consulte `API_DOCS.md` para documentação completa em Markdown com:
- Descrição detalhada de cada endpoint
- Exemplos de requisição e resposta
- Modelos de dados
- Notas importantes sobre validação

## 🔧 Personalização

Para personalizar a documentação, edite `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Seu Título')
  .setDescription('Sua Descrição')
  .setVersion('1.0')
  // ... mais opções
  .build();
```

## 📚 Recursos

- [Documentação do NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
