# Configuração da Autenticação Discord

Este projeto utiliza OAuth2 do Discord para autenticação. Siga os passos abaixo para configurar:

## 1. Criar Aplicação no Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome à sua aplicação e aceite os termos
4. Clique em "Create"

## 2. Configurar OAuth2

1. No menu lateral, clique em "OAuth2"
2. Em "Redirects", adicione a URL de callback (ambiente local):
   ```
   http://localhost:1420/callback.html
   ```
3. Clique em "Save Changes"
4. Para produção, adicione também a URL de produção, por exemplo:
   ```
   https://seu-dominio.com/callback.html
   ```

## 3. Obter Client ID

1. No menu lateral, clique em "OAuth2" → "General"
2. Copie o "CLIENT ID"

## 4. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e substitua os valores:
   ```env
   VITE_DISCORD_CLIENT_ID=seu_client_id_aqui
   VITE_DISCORD_REDIRECT_URI=http://localhost:1420/callback.html
   ```

3. Para build/produção:
   - Apps web: ajuste o `.env.production` para apontar para o domínio final, por exemplo `VITE_DISCORD_REDIRECT_URI=https://seu-dominio.com/callback.html` e rode `npm run build` com essa env.
   - **Apps desktop (Tauri):** o Discord **não** aceita esquemas customizados (`tauri://`). Cadastre um redirect HTTPS real (ex.: `https://seu-dominio.com/callback.html`) no Discord Developer Portal e configure a mesma URL em `VITE_DISCORD_REDIRECT_URI` no momento do build. A página `callback.html` (servida por esse domínio) irá redirecionar o token de volta para `tauri://localhost/#...` para o app desktop.

## 5. Executar a Aplicação

```bash
npm run dev
```

## Como Funciona

A autenticação usa o fluxo OAuth2 Implicit Grant:

1. O usuário clica em "Login com Discord"
2. É redirecionado para o Discord para autorizar a aplicação
3. Discord redireciona de volta com o access token no hash da URL
4. O token é usado para buscar os dados do usuário
5. Os dados são salvos no localStorage para persistência

## Permissões Solicitadas

- `identify`: Permite acessar informações básicas do usuário (username, avatar, etc)
- `email`: Permite acessar o email do usuário

## Segurança

**IMPORTANTE**: O arquivo `.env` contém informações sensíveis e não deve ser commitado no git. Ele já está incluído no `.gitignore`.

Para produção, você precisará:
- Configurar as variáveis de ambiente no servidor
- Atualizar a REDIRECT_URI para o domínio de produção (HTTPS que você registrou no Discord Developer Portal)
- Adicionar a nova URL de redirect no Discord Developer Portal

### Erro comum: "`tauri://localhost/callback.html` is not supported by client"
- O Discord bloqueia redirecionamentos com esquemas customizados. Use sempre uma URL `https://.../callback.html` cadastrada no Discord Developer Portal.
- No desktop, essa URL deve servir o arquivo `public/callback.html` (via hospedagem estática) para que ele possa rebater o token para `tauri://localhost/#...`.

## Página de callback no build

O arquivo `public/callback.html` persiste o `access_token` retornado pelo Discord no `localStorage` (quando servido por http/https) e redireciona para `/`. Em builds desktop, ele dá um bounce para `tauri://localhost/#...`, permitindo que o app capture o token mesmo usando um redirect HTTPS aceito pelo Discord. Certifique-se de que a URL configurada em `VITE_DISCORD_REDIRECT_URI` aponte para essa página hospedada em um domínio https válido.
