# 🔍 Debug: Requisições HTTP no Build do Tauri

## Problema
As requisições HTTP não funcionam em builds de produção do Tauri, mesmo com o plugin HTTP configurado.

## Checklist de Verificação

### 1. ✅ Plugin HTTP Instalado

**Frontend (package.json):**
```json
{
  "dependencies": {
    "@tauri-apps/plugin-http": "^2"
  }
}
```

**Backend Rust (Cargo.toml):**
```toml
[dependencies]
tauri-plugin-http = "2"
```

**Inicialização (main.rs):**
```rust
.plugin(tauri_plugin_http::init())
```

### 2. ✅ Permissões HTTP Configuradas

**Arquivo:** `src-tauri/capabilities/default.json`

```json
{
  "permissions": [
    {
      "identifier": "http:default",
      "allow": [
        { "url": "https://firstapp-3y74.onrender.com/*" },
        { "url": "https://*.onrender.com/*" },
        { "url": "http://127.0.0.1:*" },
        { "url": "http://localhost:*" },
        { "url": "https://*" },
        { "url": "http://*" }
      ]
    }
  ]
}
```

### 3. ✅ Capabilities Referenciadas no tauri.conf.json

**Arquivo:** `src-tauri/tauri.conf.json`

```json
{
  "app": {
    "security": {
      "capabilities": ["default"]
    }
  }
}
```

### 4. ✅ Variáveis de Ambiente

**Arquivo:** `.env` (na raiz do projeto)

```env
VITE_BACKEND_URL=https://firstapp-3y74.onrender.com
```

**IMPORTANTE:** As variáveis `VITE_*` são substituídas em **tempo de build**. Você DEVE:
1. Configurar o `.env` ANTES de fazer o build
2. Fazer um novo build após alterar o `.env`

## Como Debuggar

### 1. Verificar Logs no Console

O wrapper `universalFetch` agora adiciona logs detalhados. Procure por:

```
[universalFetch] Detecção Tauri: {...}
[universalFetch] Iniciando requisição: {...}
[universalFetch] Usando fetch nativo (não está no Tauri)
OU
[universalFetch] Detectado Tauri, usando plugin HTTP
[universalFetch] Opções do Tauri: {...}
[universalFetch] Resposta recebida: {...}
```

### 2. Verificar se o Tauri está sendo Detectado

Se você ver `[universalFetch] Usando fetch nativo`, significa que o Tauri não está sendo detectado. Isso pode acontecer se:
- O app não está rodando no Tauri (está no navegador)
- A detecção do Tauri não está funcionando

### 3. Verificar Permissões

Se a requisição falhar com erro de permissão, verifique:
- Se a URL está nas permissões `allow`
- Se o formato da URL está correto (com `/*` no final)
- Se as capabilities estão sendo carregadas

### 4. Testar Requisição Simples

Adicione este código temporariamente para testar:

```typescript
import { fetch } from '@tauri-apps/plugin-http';

// Teste direto do plugin HTTP
async function testDirectFetch() {
  try {
    const response = await fetch('https://firstapp-3y74.onrender.com/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'TEST-KEY-123456' }),
    });
    console.log('✅ Requisição direta funcionou:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('❌ Erro na requisição direta:', error);
  }
}

testDirectFetch();
```

## Possíveis Problemas e Soluções

### Problema 1: Plugin não está sendo usado

**Sintoma:** Logs mostram "Usando fetch nativo"

**Solução:**
- Verifique se `isTauri()` está retornando `true`
- Verifique se o plugin HTTP está instalado e inicializado
- Verifique se está rodando o build do Tauri, não o dev server

### Problema 2: Erro de Permissão

**Sintoma:** Erro sobre permissões ou URL não permitida

**Solução:**
- Adicione a URL específica nas permissões
- Verifique se o formato está correto: `{ "url": "https://dominio.com/*" }`
- Certifique-se de que as capabilities estão sendo carregadas

### Problema 3: Variável de Ambiente não Carregada

**Sintoma:** `VITE_BACKEND_URL` está `undefined` no build

**Solução:**
- Certifique-se de que o `.env` está na raiz do projeto
- Faça um novo build após alterar o `.env`
- Verifique se o `.env` não está no `.gitignore` (pode estar sendo ignorado)

### Problema 4: Streaming não Funciona

**Sintoma:** Requisições normais funcionam, mas streaming (SSE) não

**Solução:**
- O plugin HTTP do Tauri suporta streaming
- Verifique se `response.body` existe
- Verifique se `response.body.getReader()` está disponível

## Comandos para Testar

### 1. Build Limpo

```bash
# Limpar build anterior
rm -rf src-tauri/target
rm -rf dist

# Reinstalar dependências
npm install
cd src-tauri && cargo clean && cd ..

# Fazer build
npm run tauri build
```

### 2. Verificar Build

```bash
# Verificar se o plugin está no bundle
# (não há comando direto, mas você pode verificar os logs)
```

### 3. Testar em Desenvolvimento

```bash
npm run tauri dev
```

Verifique os logs no console para ver qual fetch está sendo usado.

## Logs Esperados (Funcionando)

```
[universalFetch] Detecção Tauri: { hasTauriInternals: true, ... }
[universalFetch] Iniciando requisição: { url: 'https://...', method: 'POST' }
[universalFetch] Detectado Tauri, usando plugin HTTP
[universalFetch] Opções do Tauri: { method: 'POST', hasHeaders: true, hasBody: true, ... }
[universalFetch] Resposta recebida: { status: 200, ok: true, hasBody: true }
[AuthContext] Resposta recebida em X ms
```

## Logs de Erro Comuns

### Erro: "Permission denied"
```
❌ Verifique as permissões em capabilities/default.json
❌ Adicione a URL específica nas permissões allow
```

### Erro: "fetch is not defined"
```
❌ O plugin HTTP não está instalado ou inicializado
❌ Verifique se tauri_plugin_http::init() está no main.rs
```

### Erro: "Failed to fetch"
```
❌ Pode ser problema de rede
❌ Pode ser que o Tauri não esteja sendo detectado (usando fetch nativo com CORS)
❌ Verifique os logs para ver qual fetch está sendo usado
```

## Próximos Passos

1. Execute o app buildado
2. Abra o DevTools (se disponível) ou verifique os logs do sistema
3. Procure pelos logs `[universalFetch]`
4. Compartilhe os logs para diagnóstico mais preciso
