# 🔍 Diagnóstico: Backend Não Funciona no Build

## Problema
O backend funciona na web, mas **não funciona no build do Tauri**.

## ✅ Checklist de Verificação

### 1. Variável de Ambiente no Build

**IMPORTANTE:** As variáveis `VITE_*` são substituídas em **tempo de build**, não em tempo de execução!

#### Verificar se o `.env` existe na raiz:
```bash
# Na raiz do projeto (mesmo nível que package.json)
cat .env
```

Deve conter:
```env
VITE_BACKEND_URL=https://firstapp-3y74.onrender.com
```

#### ⚠️ Se o `.env` não existir ou estiver vazio:
1. Crie o arquivo `.env` na raiz do projeto
2. Adicione: `VITE_BACKEND_URL=https://firstapp-3y74.onrender.com`
3. **Faça um novo build** (as variáveis são embutidas no código durante o build)

### 2. Verificar Logs no App Buildado

Execute o app buildado e pressione `F12` para abrir DevTools. Procure por:

```
[getBackendUrl] VITE_BACKEND_URL: ???
```

**Se mostrar `undefined`:**
- ❌ A variável não foi carregada no build
- ✅ Solução: Crie/atualize o `.env` e faça um novo build

**Se mostrar a URL correta:**
- ✅ A variável está carregada
- ❌ O problema é com as requisições HTTP

### 3. Verificar Detecção do Tauri

Procure por este log:
```
[universalFetch] Detecção Tauri: { result: true/false, ... }
```

**Se `result: false`:**
- ❌ O Tauri não está sendo detectado
- ❌ Está usando `fetch` nativo (que não funciona em produção)
- ✅ Solução: Verificar se o plugin HTTP está instalado e inicializado

**Se `result: true`:**
- ✅ Tauri detectado
- Verifique os próximos logs

### 4. Verificar Plugin HTTP

Procure por este log:
```
[universalFetch] Detectado Tauri, usando plugin HTTP
```

**Se não aparecer:**
- ❌ O plugin HTTP não está sendo usado
- Verifique se está instalado e inicializado

### 5. Verificar Permissões HTTP

O arquivo `src-tauri/capabilities/default.json` deve ter:
```json
{
  "permissions": [
    {
      "identifier": "http:default",
      "allow": [
        { "url": "https://firstapp-3y74.onrender.com/*" },
        { "url": "https://*.onrender.com/*" },
        { "url": "https://*" }
      ]
    }
  ]
}
```

### 6. Verificar Erros de Requisição

Procure por:
```
[universalFetch] Erro ao usar Tauri HTTP: ...
```

**Se aparecer erro:**
- Copie o erro completo
- Verifique se é erro de permissão ou de rede

## 🔧 Soluções Passo a Passo

### Solução 1: Garantir que .env está correto

1. **Crie/Verifique o arquivo `.env` na raiz:**
   ```env
   VITE_BACKEND_URL=https://firstapp-3y74.onrender.com
   ```

2. **Limpe o build anterior:**
   ```bash
   rm -rf dist
   rm -rf src-tauri/target
   ```

3. **Faça um novo build:**
   ```bash
   npm run tauri build
   ```

4. **Teste novamente**

### Solução 2: Verificar se Plugin HTTP está instalado

1. **Verificar package.json:**
   ```json
   {
     "dependencies": {
       "@tauri-apps/plugin-http": "^2"
     }
   }
   ```

2. **Verificar Cargo.toml:**
   ```toml
   [dependencies]
   tauri-plugin-http = "2"
   ```

3. **Verificar main.rs:**
   ```rust
   .plugin(tauri_plugin_http::init())
   ```

4. **Se faltar algo, instale:**
   ```bash
   npm install @tauri-apps/plugin-http
   ```

### Solução 3: Testar Requisição Direta

Adicione este código temporariamente para testar:

```typescript
import { fetch } from '@tauri-apps/plugin-http';

async function testDirectFetch() {
  try {
    console.log('🧪 Testando requisição direta...');
    const response = await fetch('https://firstapp-3y74.onrender.com/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'TEST-KEY-123456' }),
    });
    console.log('✅ Requisição direta funcionou:', response.status);
    const text = await response.text();
    console.log('Resposta:', text);
  } catch (error) {
    console.error('❌ Erro na requisição direta:', error);
  }
}

// Chame esta função no início do app
testDirectFetch();
```

## 📊 Logs Esperados (Funcionando)

Se tudo estiver funcionando, você deve ver:

```
[getBackendUrl] VITE_BACKEND_URL: https://firstapp-3y74.onrender.com
[AuthContext] Backend URL: https://firstapp-3y74.onrender.com
[universalFetch] Detecção Tauri: { result: true, ... }
[universalFetch] Detectado Tauri, usando plugin HTTP
[universalFetch] Opções do Tauri: { method: 'POST', ... }
[universalFetch] Resposta recebida: { status: 200, ok: true }
[AuthContext] Resposta recebida em X ms
```

## 📊 Logs de Problema

### Problema 1: Variável não carregada
```
[getBackendUrl] VITE_BACKEND_URL: undefined
[getBackendUrl] VITE_BACKEND_URL não definida, usando fallback: http://127.0.0.1:3000
```
**Solução:** Crie/atualize o `.env` e faça novo build

### Problema 2: Tauri não detectado
```
[universalFetch] Detecção Tauri: { result: false, ... }
[universalFetch] Usando fetch nativo (não está no Tauri)
```
**Solução:** Verificar se está rodando o build do Tauri, não o dev server

### Problema 3: Erro de permissão
```
[universalFetch] Erro ao usar Tauri HTTP: Permission denied
```
**Solução:** Verificar permissões em `capabilities/default.json`

### Problema 4: Erro de rede
```
[universalFetch] Erro ao usar Tauri HTTP: Network error
```
**Solução:** Verificar se o backend está acessível e se a URL está correta

## 🎯 Próximos Passos

1. **Execute o app buildado**
2. **Pressione F12** para abrir DevTools
3. **Copie TODOS os logs** que começam com:
   - `[getBackendUrl]`
   - `[universalFetch]`
   - `[AuthContext]`
4. **Compartilhe os logs** para diagnóstico preciso

## 💡 Dica: Verificar Variável no Build

Para verificar se a variável foi embutida no build, você pode:

1. Fazer o build
2. Abrir o arquivo `dist/assets/index-*.js`
3. Procurar por `firstapp-3y74.onrender.com`
4. Se encontrar, a variável foi embutida corretamente
