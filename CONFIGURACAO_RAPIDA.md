# ⚡ Configuração Rápida - Frontend + Backend

## 🎯 Passo a Passo Rápido

### 1. Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais Discord
```

No arquivo `backend/.env`:
```env
DISCORD_CLIENT_ID=seu_client_id
DISCORD_CLIENT_SECRET=seu_client_secret
PORT=3000
REDIRECT_URI=http://127.0.0.1:3000/callback
```

⚠️ **IMPORTANTE**: Use `127.0.0.1` (NÃO `localhost`) e `http://` (NÃO `https://`)

### 2. Configure o Frontend

Crie um arquivo `.env` na **raiz do projeto** (não dentro de backend):

```env
VITE_DISCORD_CLIENT_ID=seu_client_id
VITE_USE_BACKEND=true
VITE_BACKEND_URL=http://127.0.0.1:3000
VITE_DISCORD_REDIRECT_URI=http://127.0.0.1:3000/callback
```

⚠️ **IMPORTANTE**: Use `127.0.0.1` (NÃO `localhost`) e `http://` (NÃO `https://`)

### 3. Configure no Discord Developer Portal

1. Acesse https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **Redirects**
4. Clique em **Add Redirect**
5. Adicione EXATAMENTE: `http://127.0.0.1:3000/callback`
6. Clique em **Save Changes**

⚠️ **CRÍTICO**: O redirect_uri deve ser EXATAMENTE igual nos três lugares:
- Discord Developer Portal
- `backend/.env` (REDIRECT_URI)
- `.env` raiz (VITE_DISCORD_REDIRECT_URI)

### 4. Inicie os Serviços

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Teste

1. Acesse http://localhost:1420
2. Clique em "Login com Discord"
3. Complete a autenticação
4. Você será redirecionado de volta e estará logado!

## ✅ Verificação

- ✅ Backend rodando em http://127.0.0.1:3000
- ✅ Frontend rodando em http://localhost:1420
- ✅ `.env` configurado na raiz
- ✅ `backend/.env` configurado
- ✅ Redirect URI configurado no Discord: `http://127.0.0.1:3000/callback`
- ✅ **Todos os redirect_uri são IDÊNTICOS** (Discord, backend, frontend)

## ⚠️ Erro "redirect_uri inválido"?

Consulte `REDIRECT_URI_FIX.md` para solução detalhada!

## 🔍 Logs

No console do navegador (F12), você verá:
- `🔗 Usando backend: http://localhost:3000`
- `📥 Enviando código para backend...`
- `✅ Resposta do backend recebida`
- `✅ Login bem-sucedido!`

## 📚 Documentação Completa

- `FRONTEND_CONFIG.md` - Configuração detalhada do frontend
- `PRODUCTION_SETUP.md` - Guia completo de produção
- `backend/README.md` - Documentação do backend
