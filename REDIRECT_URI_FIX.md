# 🔧 Correção: redirect_uri OAuth2 Inválido

## ❌ Problema

Erro: `redirect_uri_mismatch` ou "redirect_uri de oauth2 inválido"

## ✅ Solução

O Discord OAuth2 é **muito sensível** ao `redirect_uri`. Ele deve ser **EXATAMENTE** igual em:
1. Código do frontend
2. Código do backend  
3. Discord Developer Portal

### Passo 1: Configurar no Discord Developer Portal

1. Acesse https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **Redirects**
4. Clique em **Add Redirect**
5. Adicione EXATAMENTE: `http://127.0.0.1:3000/callback`
   - ⚠️ Use `127.0.0.1` (NÃO `localhost`)
   - ⚠️ Use `http://` (NÃO `https://`)
   - ⚠️ Use porta `3000`
   - ⚠️ Use `/callback` no final
6. Clique em **Save Changes**

### Passo 2: Configurar o Backend

No arquivo `backend/.env`:

```env
REDIRECT_URI=http://127.0.0.1:3000/callback
```

⚠️ **IMPORTANTE**: Deve ser EXATAMENTE `http://127.0.0.1:3000/callback`

### Passo 3: Configurar o Frontend

No arquivo `.env` na raiz do projeto:

```env
VITE_DISCORD_CLIENT_ID=seu_client_id
VITE_USE_BACKEND=true
VITE_BACKEND_URL=http://127.0.0.1:3000
VITE_DISCORD_REDIRECT_URI=http://127.0.0.1:3000/callback
```

⚠️ **IMPORTANTE**: 
- Use `127.0.0.1` (NÃO `localhost`)
- Use `http://` (NÃO `https://`)
- Deve ser EXATAMENTE igual ao configurado no Discord

### Passo 4: Verificar Consistência

Todos os três lugares devem ter o MESMO valor:

1. ✅ Discord Developer Portal: `http://127.0.0.1:3000/callback`
2. ✅ Backend `.env`: `REDIRECT_URI=http://127.0.0.1:3000/callback`
3. ✅ Frontend `.env`: `VITE_DISCORD_REDIRECT_URI=http://127.0.0.1:3000/callback`

## 🔍 Verificação

### No Console do Navegador

Ao fazer login, você verá:
```
↩️ Redirect URI: http://127.0.0.1:3000/callback
⚠️ IMPORTANTE: Este redirect_uri DEVE estar configurado no Discord Developer Portal!
```

### No Console do Backend

Ao iniciar, você verá:
```
🔗 Redirect URI: http://127.0.0.1:3000/callback
```

## 🐛 Erros Comuns

### Erro: "redirect_uri_mismatch"

**Causa**: O redirect_uri não está exatamente igual em todos os lugares.

**Solução**:
1. Verifique se está usando `127.0.0.1` (não `localhost`)
2. Verifique se está usando `http://` (não `https://`)
3. Verifique se a porta é `3000`
4. Verifique se termina com `/callback`
5. Verifique se está configurado no Discord Developer Portal

### Erro: "Invalid redirect_uri"

**Causa**: O redirect_uri não está registrado no Discord Developer Portal.

**Solução**:
1. Acesse o Discord Developer Portal
2. Vá em OAuth2 → Redirects
3. Adicione o redirect_uri exato: `http://127.0.0.1:3000/callback`
4. Salve as alterações
5. Aguarde alguns segundos para as mudanças serem aplicadas

## 📝 Checklist

- [ ] Redirect URI configurado no Discord Developer Portal
- [ ] `REDIRECT_URI` no `backend/.env` está correto
- [ ] `VITE_DISCORD_REDIRECT_URI` no `.env` (raiz) está correto
- [ ] Todos usam `127.0.0.1` (não `localhost`)
- [ ] Todos usam `http://` (não `https://`)
- [ ] Todos usam porta `3000`
- [ ] Todos terminam com `/callback`
- [ ] Backend reiniciado após mudanças
- [ ] Frontend reiniciado após mudanças

## 🎯 Exemplo Correto

**Discord Developer Portal:**
```
http://127.0.0.1:3000/callback
```

**backend/.env:**
```env
REDIRECT_URI=http://127.0.0.1:3000/callback
```

**.env (raiz):**
```env
VITE_DISCORD_REDIRECT_URI=http://127.0.0.1:3000/callback
```

Todos os três devem ser **IDÊNTICOS**!
