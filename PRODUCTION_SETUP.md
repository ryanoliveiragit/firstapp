# 🚀 Guia de Configuração para Produção

Este guia explica como configurar e executar o projeto em produção com o backend separado.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Discord Developer Portal
- Servidor para hospedar o backend (opcional, pode rodar localmente)

## 🔧 Configuração do Backend

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
PORT=3000
REDIRECT_URI=http://127.0.0.1:3000/callback
ALLOWED_ORIGINS=http://localhost:1420,http://127.0.0.1:1420
```

### 3. Iniciar o Backend

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O backend estará rodando em `http://localhost:3000`

## 🌐 Configuração do Frontend

### 1. Configurar Variáveis de Ambiente

No arquivo `.env` na raiz do projeto:

```env
VITE_DISCORD_CLIENT_ID=seu_client_id_aqui
VITE_USE_BACKEND=true
VITE_BACKEND_URL=http://localhost:3000
```

**Variáveis importantes:**
- `VITE_USE_BACKEND=true` - Ativa o modo backend (obrigatório para produção web)
- `VITE_BACKEND_URL` - URL do backend (padrão: http://localhost:3000)

### 2. Build do Frontend

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## 🔐 Configuração no Discord Developer Portal

1. Acesse https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **Redirects**
4. Adicione os redirect URIs:
   - **Desenvolvimento**: `http://127.0.0.1:3000/callback`
   - **Produção**: `https://seu-dominio.com/callback` (se hospedar o backend)

## 🎯 Modos de Operação

### Modo Desktop (Tauri)
- Usa servidor HTTP local no Rust
- Não precisa do backend Node.js
- `VITE_USE_BACKEND` não precisa estar definido ou pode ser `false`

### Modo Web (Produção)
- **Requer** o backend Node.js rodando
- `VITE_USE_BACKEND=true` deve estar definido
- `VITE_BACKEND_URL` deve apontar para o backend

## 🐳 Deploy em Produção

### Opção 1: Backend Local (Desenvolvimento)

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev
```

### Opção 2: Backend em Servidor

1. **Hospede o backend** em um servidor (ex: Heroku, Railway, Vercel, etc.)
2. Configure `VITE_BACKEND_URL` no frontend para apontar para o servidor
3. Adicione a URL de produção no Discord Developer Portal

### Opção 3: Docker

Crie um `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
      - DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
      - REDIRECT_URI=http://localhost:3000/callback
    restart: unless-stopped
```

Execute:
```bash
docker-compose up -d
```

## 📝 Checklist de Produção

- [ ] Backend configurado e rodando
- [ ] Variáveis de ambiente configuradas no backend
- [ ] `VITE_USE_BACKEND=true` no frontend
- [ ] `VITE_BACKEND_URL` apontando para o backend correto
- [ ] Redirect URI configurado no Discord Developer Portal
- [ ] Frontend buildado (`npm run build`)
- [ ] Testado o fluxo completo de login

## 🔍 Troubleshooting

### Backend não inicia
- Verifique se a porta 3000 está livre
- Verifique se `DISCORD_CLIENT_ID` e `DISCORD_CLIENT_SECRET` estão definidos

### Erro "redirect_uri_mismatch"
- Verifique se o `REDIRECT_URI` no backend está exatamente igual ao configurado no Discord
- Verifique se o `VITE_BACKEND_URL` no frontend está correto

### CORS Error
- Configure `ALLOWED_ORIGINS` no backend `.env`
- Adicione a origem do frontend na lista

### Frontend não encontra o backend
- Verifique se o backend está rodando
- Verifique se `VITE_BACKEND_URL` está correto
- Teste acessando `http://localhost:3000/health` no navegador

## 📚 Documentação Adicional

- `backend/README.md` - Documentação completa do backend
- `DISCORD_AUTH_SETUP.md` - Configuração do Discord OAuth
