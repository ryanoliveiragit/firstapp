# 🔧 Configuração do Frontend para Usar o Backend

Este guia explica como configurar o frontend para usar o backend Node.js.

## 📝 Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Discord OAuth Configuration
VITE_DISCORD_CLIENT_ID=seu_client_id_aqui

# Backend Configuration
# Ative o uso do backend (true) ou use servidor local do Tauri (false/undefined)
VITE_USE_BACKEND=true

# URL do backend (padrão: http://localhost:3000)
# Para produção, altere para a URL do seu servidor
VITE_BACKEND_URL=http://localhost:3000

# Redirect URI (opcional, usado apenas para referência)
# O redirect URI real é configurado no backend e no Discord Developer Portal
VITE_DISCORD_REDIRECT_URI=http://127.0.0.1:3000/callback
```

## ⚙️ Variáveis de Ambiente

### Obrigatórias

- **`VITE_DISCORD_CLIENT_ID`**: Client ID do Discord (obtido no Discord Developer Portal)

### Opcionais

- **`VITE_USE_BACKEND`**: 
  - `true` - Usa o backend Node.js (recomendado para produção web)
  - `false` ou não definido - Usa servidor local do Tauri (apenas para desktop)
  - **Padrão**: `true` se não estiver rodando no Tauri, `false` se estiver no Tauri

- **`VITE_BACKEND_URL`**: 
  - URL do backend Node.js
  - **Padrão**: `http://localhost:3000`
  - Para produção, use: `https://seu-dominio.com`

- **`VITE_DISCORD_REDIRECT_URI`**: 
  - Apenas para referência
  - O redirect URI real deve estar configurado no backend e no Discord

## 🚀 Como Funciona

### Modo Backend (VITE_USE_BACKEND=true)

1. Usuário clica em "Login com Discord"
2. Frontend redireciona para Discord OAuth
3. Discord redireciona para `${VITE_BACKEND_URL}/callback?code=...`
4. Backend troca código por token
5. Backend retorna dados do usuário
6. Frontend salva no localStorage

### Modo Tauri (VITE_USE_BACKEND=false ou não definido)

1. Usuário clica em "Login com Discord"
2. Tauri inicia servidor HTTP local na porta 3000
3. Tauri abre navegador com URL do Discord
4. Discord redireciona para `http://127.0.0.1:3000/callback?code=...`
5. Servidor local captura código e emite evento
6. Frontend troca código por token diretamente
7. Frontend salva no localStorage

## 📋 Checklist de Configuração

- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] `VITE_DISCORD_CLIENT_ID` configurado
- [ ] `VITE_USE_BACKEND=true` definido (para usar backend)
- [ ] `VITE_BACKEND_URL` apontando para o backend correto
- [ ] Backend rodando na porta configurada
- [ ] Redirect URI configurado no Discord Developer Portal

## 🔍 Verificação

Após configurar, você pode verificar no console do navegador:

1. Abra o DevTools (F12)
2. Vá na aba Console
3. Ao fazer login, você verá logs como:
   - `Iniciando fluxo OAuth Discord...`
   - `Usando backend: http://localhost:3000`
   - `Código OAuth recebido, iniciando troca por token...`

## 🐛 Troubleshooting

### Frontend não encontra o backend

**Erro**: `Failed to fetch` ou `Network error`

**Solução**:
- Verifique se o backend está rodando: `npm run backend:start`
- Verifique se `VITE_BACKEND_URL` está correto
- Teste acessando `http://localhost:3000/health` no navegador

### Erro "redirect_uri_mismatch"

**Solução**:
- Verifique se o redirect URI no Discord Developer Portal está exatamente igual ao configurado no backend
- Deve ser: `http://127.0.0.1:3000/callback` (desenvolvimento)

### Backend não está sendo usado

**Sintomas**: Ainda usa servidor local do Tauri

**Solução**:
- Verifique se `VITE_USE_BACKEND=true` está no `.env`
- Reinicie o servidor de desenvolvimento: `npm run dev`
- Verifique no console se aparece "Usando backend: ..."

## 📚 Próximos Passos

1. Configure o `.env` conforme este guia
2. Inicie o backend: `npm run backend:start`
3. Inicie o frontend: `npm run dev`
4. Teste o login com Discord

Para mais informações, consulte:
- `PRODUCTION_SETUP.md` - Guia completo de produção
- `backend/README.md` - Documentação do backend
