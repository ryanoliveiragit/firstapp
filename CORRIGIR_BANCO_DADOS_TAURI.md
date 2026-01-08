# 🔧 Como Corrigir Armazenamento de Banco de Dados no Tauri

## ❌ Código do Electron (NÃO funciona no Tauri)

```javascript
// ❌ ERRADO - Isso é código do Electron
const dbPath = path.join(app.getPath("userData"), "sample.db");
```

## ✅ Código Correto para Tauri 2.0

### Solução Simples (Usando API Core - Recomendado)

No Tauri 2.0, você **não precisa de plugins adicionais** para obter o diretório de dados. Use a API core:

```typescript
import { appDataDir, join } from '@tauri-apps/api/path';

// Obtém o diretório de dados do app
const dataDir = await appDataDir();

// Junta com o nome do arquivo de banco
const dbPath = await join(dataDir, 'sample.db');

console.log('Caminho do banco:', dbPath);
```

### Arquivo Completo Criado

Criei o arquivo `src/utils/databasePath.ts` com funções prontas para usar:

```typescript
import { getDatabasePath, getAppDataDirectory } from './utils/databasePath';

// Obter caminho completo do banco
const dbPath = await getDatabasePath('sample.db');

// Ou apenas o diretório
const dataDir = await getAppDataDirectory();
```

## 📁 Onde o Banco é Armazenado

O diretório de dados varia por sistema operacional:

- **Windows**: `C:\Users\{username}\AppData\Roaming\com.firstapp.dev\`
- **macOS**: `~/Library/Application Support/com.firstapp.dev/`
- **Linux**: `~/.local/share/com.firstapp.dev/`

O `com.firstapp.dev` vem do `identifier` no `tauri.conf.json`:
```json
{
  "identifier": "com.firstapp.dev"
}
```

## 🔍 Verificar se Está Funcionando

Adicione este código temporariamente para ver o caminho:

```typescript
import { getDatabasePath } from './utils/databasePath';

async function debugPath() {
  const path = await getDatabasePath('sample.db');
  console.log('📁 Caminho do banco:', path);
}

debugPath();
```

Isso mostrará no console (F12) onde o banco está sendo armazenado.

## ⚠️ Importante

1. **Não precisa instalar plugins adicionais** - `appDataDir` e `join` estão na API core do Tauri 2.0
2. **Não precisa configurar permissões** - A API core já tem as permissões necessárias
3. **O diretório é criado automaticamente** quando você salva o primeiro arquivo

## 📝 Comparação: Electron vs Tauri

| Electron | Tauri 2.0 |
|----------|-----------|
| `app.getPath("userData")` | `appDataDir()` |
| `path.join(dir, file)` | `join(dir, file)` |
| Precisa de `electron` | Precisa de `@tauri-apps/api` |

## ✅ Checklist

- [x] Arquivo `src/utils/databasePath.ts` criado
- [x] Usando `appDataDir()` em vez de `app.getPath()`
- [x] Usando `join()` em vez de `path.join()`
- [x] Sem necessidade de plugins adicionais
- [x] Sem necessidade de configurar permissões extras

## 🎯 Próximos Passos

1. Importe a função onde precisar:
   ```typescript
   import { getDatabasePath } from './utils/databasePath';
   ```

2. Use para obter o caminho:
   ```typescript
   const dbPath = await getDatabasePath('sample.db');
   ```

3. Use o caminho com sua biblioteca de banco de dados (SQLite, etc.)
