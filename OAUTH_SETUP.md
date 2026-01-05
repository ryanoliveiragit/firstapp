# Configuração do GitHub OAuth

Este documento explica como configurar o GitHub OAuth para o Synapse.

## Como funciona o fluxo de autenticação

1. **Usuário clica em "Continuar com GitHub"** na tela de login
2. **O app inicia um servidor local** na porta 3000 para receber o callback
3. **Navegador padrão abre** com a página de autorização do GitHub
4. **Usuário autoriza** o aplicativo no GitHub
5. **GitHub redireciona** para `http://127.0.0.1:3000/callback` com um código
6. **Servidor local captura** o código e mostra página de sucesso
7. **App troca o código** por um access token usando a API do GitHub
8. **App busca dados do usuário** e salva no localStorage
9. **Usuário é redirecionado** automaticamente para a página de inserir chave

## Passo a passo para configurar

### 1. Criar uma OAuth App no GitHub

1. Acesse https://github.com/settings/developers
2. Clique em **"New OAuth App"**
3. Preencha o formulário:
   - **Application name**: `Synapse` (ou o nome que preferir)
   - **Homepage URL**: `http://localhost:1420`
   - **Authorization callback URL**: `http://127.0.0.1:3000/callback`
   - **Application description**: (opcional) "Plataforma de otimização de performance"

4. Clique em **"Register application"**

### 2. Obter credenciais

Após criar o app, você verá:
- **Client ID**: Copie este valor
- **Client Secret**: Clique em **"Generate a new client secret"** e copie o valor

⚠️ **IMPORTANTE**: O Client Secret só será mostrado uma vez! Guarde em local seguro.

### 3. Configurar variáveis de ambiente

1. Na raiz do projeto, copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   VITE_GITHUB_CLIENT_ID=seu_client_id_aqui
   VITE_GITHUB_CLIENT_SECRET=seu_client_secret_aqui
   ```

### 4. Testar o fluxo

1. Inicie o app em modo desenvolvimento:
   ```bash
   npm run tauri dev
   ```

2. Clique em "Continuar com GitHub"
3. O navegador abrirá a página de autorização do GitHub
4. Autorize o aplicativo
5. Você verá uma página de sucesso no navegador
6. O app deve redirecionar automaticamente para a tela de inserir chave

## Solução de problemas

### Erro: "Failed to start server"
- Verifique se a porta 3000 não está em uso
- Tente fechar outros aplicativos que possam estar usando essa porta

### Erro: "Não foi possível obter o token de acesso"
- Verifique se o Client Secret está correto no arquivo `.env`
- Certifique-se de que a callback URL no GitHub está exatamente: `http://127.0.0.1:3000/callback`

### O app não redireciona após o login
- Verifique o console do navegador e do terminal para erros
- Certifique-se de que as variáveis de ambiente estão configuradas corretamente
- Tente limpar o localStorage e fazer login novamente

### Erro de CORS
- Isso é normal! O OAuth funciona abrindo o navegador externo, não dentro do app

## Segurança

⚠️ **NUNCA** comite o arquivo `.env` com suas credenciais reais!
- O arquivo `.env` está no `.gitignore`
- Sempre use `.env.example` como template
- Em produção, use variáveis de ambiente do sistema

## Arquitetura técnica

### Backend (Rust/Tauri)

- **`start_oauth_listener`**: Inicia servidor HTTP na porta 3000
- **`open_github_oauth`**: Abre navegador com URL de autorização
- Servidor captura callback e emite evento para frontend

### Frontend (React/TypeScript)

- **`AuthContext`**: Gerencia estado de autenticação
- Escuta evento `oauth-callback` do Tauri
- Troca código por token usando API do GitHub
- Busca dados do usuário e salva no localStorage

### Fluxo de dados

```
Login.tsx → AuthContext.login()
            ↓
        Tauri: start_oauth_listener()
            ↓
        Tauri: open_github_oauth()
            ↓
        Navegador: github.com/login/oauth/authorize
            ↓
        Usuário autoriza
            ↓
        GitHub redireciona: 127.0.0.1:3000/callback?code=xxx
            ↓
        Servidor local captura código
            ↓
        Emite evento: oauth-callback
            ↓
        AuthContext recebe evento
            ↓
        Troca código por token (fetch github.com/login/oauth/access_token)
            ↓
        Busca usuário (fetch api.github.com/user)
            ↓
        Salva no localStorage
            ↓
        App.tsx detecta user = true, licenseKey = null
            ↓
        Renderiza KeyInput.tsx
```

## Referências

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Tauri Documentation](https://tauri.app)
