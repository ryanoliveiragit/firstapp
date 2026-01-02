# Configuração da Autenticação Discord

Este projeto utiliza OAuth2 do Discord para autenticação com **Deep Links** para suporte desktop (Tauri).

## 🔐 O que são Deep Links?

Deep Links permitem que aplicações desktop capturem URLs de callback OAuth sem precisar de um servidor HTTP rodando. Ao invés de usar `http://localhost:1420/callback`, usamos `synapse://callback`, que é um protocolo customizado registrado no sistema operacional.

## ✅ Vantagens desta Abordagem

- ✅ Funciona tanto em **desenvolvimento** quanto em **produção**
- ✅ Não precisa de servidor HTTP rodando
- ✅ Abre o navegador padrão do usuário para login
- ✅ App captura automaticamente o callback após autenticação

---

## 📝 Passo a Passo de Configuração

### 1. Criar Aplicação no Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome à sua aplicação (ex: "Synapse")
4. Aceite os termos e clique em "Create"

### 2. Configurar OAuth2 com Deep Link

1. No menu lateral, clique em "OAuth2"
2. Em "Redirects", adicione a URL de callback usando deep link:
   ```
   synapse://callback
   ```
3. Clique em "Save Changes"

**⚠️ IMPORTANTE**: Use exatamente `synapse://callback` (não `http://localhost:1420/callback`)

### 3. Obter Client ID

1. No menu lateral, clique em "OAuth2" → "General"
2. Copie o "CLIENT ID"

### 4. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione seu Client ID:
   ```env
   VITE_DISCORD_CLIENT_ID=seu_client_id_aqui
   ```

**Nota**: O redirect URI está hardcoded no código como `synapse://callback`, você não precisa configurá-lo no `.env`

### 5. Executar a Aplicação

**Desenvolvimento:**
```bash
npm run tauri dev
```

**Build de Produção:**
```bash
npm run tauri build
```

---

## 🔄 Como Funciona

A autenticação usa o fluxo OAuth2 Implicit Grant com Deep Links:

1. **Usuário clica em "Login com Discord"**
   - O app abre o navegador padrão do sistema

2. **Discord solicita autorização**
   - Usuário faz login e autoriza a aplicação

3. **Discord redireciona para `synapse://callback`**
   - O sistema operacional detecta o protocolo `synapse://`
   - Automaticamente abre a aplicação Tauri

4. **App captura o token**
   - O plugin `tauri-plugin-deep-link` intercepta a URL
   - Extrai o access token do callback

5. **Busca dados do usuário**
   - Usa o token para buscar dados da API do Discord
   - Salva no localStorage para persistência

---

## 🔑 Permissões Solicitadas

- `identify`: Informações básicas (username, avatar, ID)
- `email`: Email do usuário Discord

---

## 🛡️ Segurança

- ✅ `.env` está no `.gitignore` (não commite credenciais)
- ✅ Token é armazenado apenas no localStorage local
- ✅ Deep link funciona apenas quando o app está instalado
- ✅ OAuth2 Implicit Grant é seguro para aplicações desktop

---

## 🐛 Solução de Problemas

### "Não consigo chegar a esta página" após login

**Causa**: O redirect URI no Discord não está configurado corretamente.

**Solução**: Certifique-se de que adicionou `synapse://callback` (não `http://localhost:1420/callback`) no Discord Developer Portal.

### Deep link não está abrindo o app

**Desenvolvimento**: Execute com `npm run tauri dev` (não apenas `npm run dev`)

**Produção**: Faça o build e instale o app com `npm run tauri build`, então instale o executável gerado.

### Erro ao compilar Rust

Execute:
```bash
cd src-tauri
cargo clean
cargo build
```

---

## 📦 Produção vs Desenvolvimento

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Comando | `npm run tauri dev` | `npm run tauri build` + instalar app |
| Deep Link | ✅ Funciona | ✅ Funciona |
| Callback | `synapse://callback` | `synapse://callback` |
| Navegador | Abre browser externo | Abre browser externo |

**Não precisa subir servidor em produção!** O deep link funciona automaticamente.
