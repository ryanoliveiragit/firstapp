# Configuração da Autenticação Discord

Este projeto utiliza OAuth2 do Discord para autenticação. Siga os passos abaixo para configurar:

> Agora utilizamos o [tauri-plugin-oauth](https://crates.io/crates/tauri-plugin-oauth) para receber o callback do Discord por meio de um servidor local temporário. Certifique-se de que a porta configurada esteja liberada.

## 1. Criar Aplicação no Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome à sua aplicação e aceite os termos
4. Clique em "Create"

## 2. Configurar OAuth2

1. No menu lateral, clique em "OAuth2"
2. Em "Redirects", adicione a URL de callback:
   ```
   http://localhost:1420/callback
   ```
3. Clique em "Save Changes"

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
   VITE_DISCORD_REDIRECT_PORT=1420
   ```

## 5. Executar a Aplicação

```bash
npm run dev
```

## Como Funciona

A autenticação usa o fluxo OAuth2 com um servidor local criado pelo plugin:

1. O usuário clica em "Login com Discord".
2. O `tauri-plugin-oauth` inicia um servidor local na porta configurada (padrão: 1420).
3. O Discord redireciona para `http://localhost:1420/callback` com os dados do OAuth.
4. O plugin captura o URL de redirecionamento e o app extrai o token para buscar os dados do usuário.
5. Os dados são salvos no `localStorage` para persistência.

## Permissões Solicitadas

- `identify`: Permite acessar informações básicas do usuário (username, avatar, etc)
- `email`: Permite acessar o email do usuário

## Segurança

**IMPORTANTE**: O arquivo `.env` contém informações sensíveis e não deve ser commitado no git. Ele já está incluído no `.gitignore`.

Para produção, você precisará:
- Configurar as variáveis de ambiente no servidor
- Garantir que a porta configurada esteja liberada ou ajustar `VITE_DISCORD_REDIRECT_PORT`
- Adicionar a nova URL de redirect no Discord Developer Portal
