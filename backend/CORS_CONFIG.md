# 🌐 Configuração de CORS

## ✅ CORS Totalmente Liberado

O CORS foi configurado para **permitir todas as origens**, incluindo:

- ✅ Apps desktop (Tauri, Wails, Electron, etc.)
- ✅ Requisições sem origem (null origin)
- ✅ Qualquer IP ou domínio
- ✅ Requisições locais (localhost)
- ✅ Requisições de produção

## 🔧 Configuração Atual

```typescript
const corsOptions = {
  origin: true, // Permite todas as origens
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
};
```

## 📋 Detalhes da Configuração

### `origin: true`
- Permite **todas as origens** sem restrições
- Inclui requisições sem origem (apps desktop)
- Inclui `null` origin (alguns apps desktop)

### `credentials: true`
- Permite envio de cookies e credenciais
- Necessário para autenticação com cookies

### `methods`
- Todos os métodos HTTP permitidos
- Inclui OPTIONS para preflight requests

### `allowedHeaders`
- Headers permitidos nas requisições
- Inclui headers comuns e customizados

### `exposedHeaders`
- Headers que o cliente pode ler na resposta

### `maxAge`
- Tempo de cache para preflight requests (24 horas)

## 🚀 Apps Desktop Suportados

Esta configuração funciona com:

- ✅ **Tauri** - Apps desktop com Rust
- ✅ **Wails** - Apps desktop com Go
- ✅ **Electron** - Apps desktop com Node.js
- ✅ **Qualquer outro app desktop** que faça requisições HTTP

## ⚠️ Segurança

**Nota:** Esta configuração permite todas as origens. Para produção, considere:

1. **Restringir origens** se necessário para segurança adicional
2. **Usar autenticação** adequada (tokens, API keys, etc.)
3. **Rate limiting** para prevenir abuso
4. **HTTPS** em produção

## 🔄 Como Reverter (se necessário)

Se precisar restringir CORS no futuro, edite `src/main.ts`:

```typescript
const corsOptions = {
  origin: ['http://localhost:5173', 'https://seu-dominio.com'],
  // ... resto da configuração
};
```

## ✅ Teste

Para testar se o CORS está funcionando:

1. **Inicie o servidor:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Teste de um app desktop:**
   - Faça uma requisição do Tauri/Wails
   - Deve funcionar sem erros de CORS

3. **Teste do navegador:**
   - Abra o DevTools (F12)
   - Verifique que não há erros de CORS no console

## 📝 Logs

Ao iniciar o servidor, você verá:

```
🌐 CORS: Totalmente liberado (permite todas as origens, incluindo apps desktop)
```

Isso confirma que o CORS está configurado corretamente.
