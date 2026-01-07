# 🔧 Correção de Requisições de Rede no Build do Tauri

## Problema
Em desenvolvimento, as requisições para a API do backend funcionam corretamente, mas após fazer o build do Tauri, as requisições não conseguem acessar a API.

## Causas Identificadas

1. **Inconsistência nas URLs da API**: 
   - `AuthContext.tsx` usava `VITE_BACKEND_URL` ou padrão `http://127.0.0.1:3000`
   - `adminService.ts` usava `VITE_API_URL` ou padrão `http://localhost:3000/api` (inconsistente!)

2. **CSP (Content Security Policy) do Tauri**:
   - O CSP pode estar bloqueando requisições de rede no build
   - Necessário permitir conexões para `localhost` e `127.0.0.1` em todas as portas

3. **Variáveis de ambiente não carregadas no build**:
   - As variáveis `VITE_*` podem não estar sendo carregadas corretamente no build do Tauri

## Soluções Aplicadas

### 1. Padronização das URLs da API

**Antes:**
```typescript
// adminService.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**Depois:**
```typescript
// adminService.ts
const getBackendUrl = () => {
  const envBackend = import.meta.env.VITE_BACKEND_URL;
  if (envBackend) {
    return envBackend;
  }
  return 'http://127.0.0.1:3000';
};

const API_URL = `${getBackendUrl()}/api`;
```

Agora ambos os arquivos (`AuthContext.tsx` e `adminService.ts`) usam a mesma função `getBackendUrl()` e a mesma variável de ambiente `VITE_BACKEND_URL`.

### 2. Ajuste do CSP no Tauri

**Arquivo:** `src-tauri/tauri.conf.json`

**Antes:**
```json
"csp": "default-src 'self'; connect-src 'self' https://firstapp-3y74.onrender.com http://localhost:3000 http://127.0.0.1:3000; ..."
```

**Depois:**
```json
"csp": "default-src 'self'; connect-src 'self' https://firstapp-3y74.onrender.com http://localhost:3000 http://127.0.0.1:3000 http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; ..."
```

Adicionado suporte para:
- `http://localhost:*` - Qualquer porta em localhost
- `http://127.0.0.1:*` - Qualquer porta em 127.0.0.1
- `ws://localhost:*` - WebSockets em localhost
- `ws://127.0.0.1:*` - WebSockets em 127.0.0.1

### 3. Logs de Debug

Adicionados logs de console para facilitar o debug:
- `[AuthContext] Backend URL:` - Mostra a URL sendo usada
- `[AuthContext] VITE_BACKEND_URL:` - Mostra a variável de ambiente
- `[AdminService] API URL:` - Mostra a URL da API
- `[AdminService] VITE_BACKEND_URL:` - Mostra a variável de ambiente

## Como Testar

1. **Verificar variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto com:
     ```env
     VITE_BACKEND_URL=http://127.0.0.1:3000
     ```

2. **Fazer build do Tauri**:
   ```bash
   npm run tauri build
   ```

3. **Verificar logs no console**:
   - Abra o DevTools do Tauri (se disponível) ou verifique os logs do sistema
   - Procure por `[AuthContext]` e `[AdminService]` nos logs

4. **Testar requisições**:
   - Tente fazer login com uma chave válida
   - Verifique se as requisições estão sendo feitas corretamente

## Possíveis Problemas Adicionais

Se ainda não funcionar após essas correções:

1. **Backend não está rodando**:
   - Certifique-se de que o backend está rodando em `http://127.0.0.1:3000`
   - Verifique se o backend aceita requisições do Tauri (CORS)

2. **Firewall/Antivírus**:
   - Pode estar bloqueando conexões de rede do aplicativo Tauri
   - Adicione exceção para o executável do Tauri

3. **Variáveis de ambiente no build**:
   - No Tauri, as variáveis `VITE_*` são embutidas no código durante o build
   - Certifique-se de que o `.env` está na raiz do projeto antes de fazer o build

4. **CORS no backend**:
   - Verifique se o backend está configurado para aceitar requisições do Tauri
   - O backend deve permitir `http://localhost:1420` ou a origem do Tauri

## Configuração Recomendada

### `.env` (raiz do projeto)
```env
VITE_BACKEND_URL=http://127.0.0.1:3000
```

### `backend/.env`
```env
PORT=3000
CORS_ORIGIN=http://localhost:1420,http://127.0.0.1:1420
```

### `src-tauri/tauri.conf.json`
```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://*; ..."
    }
  }
}
```

## Notas Importantes

- Use `127.0.0.1` em vez de `localhost` para evitar problemas de resolução DNS
- O CSP do Tauri é mais restritivo no build do que em desenvolvimento
- As variáveis `VITE_*` são substituídas em tempo de build, não em tempo de execução
- Sempre teste o build antes de distribuir o aplicativo
