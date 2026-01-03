# Configuração da Autenticação Discord

Este projeto utiliza OAuth2 do Discord para autenticação. Siga os passos abaixo para configurar:

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
   VITE_DISCORD_REDIRECT_URI=http://localhost:1420/callback
   ```

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

## Produção (Build Desktop)

O projeto está configurado para funcionar perfeitamente em produção! Aqui está o que acontece:

### Como Funciona em Produção

1. **Servidor HTTP Local Embutido**:
   - Quando você faz o build do app (`npm run tauri build`), o Tauri inclui um servidor HTTP local que escuta em `http://localhost:1420`
   - Este servidor só roda em produção (não interfere com o dev server)
   - Ele recebe os callbacks do Discord e redireciona para o app

2. **Mesma URL de Callback**:
   - Tanto em desenvolvimento quanto em produção, usamos `http://localhost:1420/callback`
   - Não é necessário alterar nada no Discord Developer Portal
   - Não é necessário criar uma API externa ou servidor na nuvem

3. **Build e Distribuição**:
   ```bash
   # Fazer build do app desktop
   npm run tauri build

   # O executável estará em:
   # Windows: src-tauri/target/release/firstapp.exe
   # Linux: src-tauri/target/release/firstapp
   # macOS: src-tauri/target/release/bundle/macos/
   ```

4. **Instalação em Outros Computadores**:
   - O app funciona em qualquer computador
   - O servidor HTTP local inicia automaticamente quando o app é aberto
   - O usuário não precisa fazer nenhuma configuração adicional
   - A autenticação Discord funciona perfeitamente offline (após o primeiro login)

### Requisitos para Produção

- **Porta 1420 livre**: O app precisa que a porta 1420 esteja disponível no computador do usuário
- **Client ID do Discord**: Configure o `VITE_DISCORD_CLIENT_ID` no arquivo `.env` antes do build
- **Callback registrado**: Certifique-se de que `http://localhost:1420/callback` está cadastrado no Discord Developer Portal

### Troubleshooting

**Problema**: "Erro ao conectar ao Discord"
- **Solução**: Verifique se a porta 1420 não está sendo usada por outro aplicativo

**Problema**: "Invalid redirect_uri"
- **Solução**: Confirme que `http://localhost:1420/callback` está adicionado nas URLs de redirect no Discord Developer Portal

**Problema**: "App não abre após autenticação"
- **Solução**: O servidor local redireciona automaticamente após 1 segundo. Se não funcionar, feche o navegador e abra o app novamente - você já estará autenticado!
