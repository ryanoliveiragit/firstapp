# 📊 Como Ver Logs do Console no App Desktop Tauri

## 🎯 Métodos para Ver Logs

### 1. **Em Desenvolvimento (Recomendado)**

Quando você roda `npm run tauri dev`, os logs aparecem automaticamente:

#### **Terminal onde você executou o comando**
- Todos os `console.log()` do JavaScript aparecem no terminal
- Logs do Rust aparecem no terminal
- Erros aparecem em vermelho

#### **DevTools do Navegador**
- Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
- Ou `Cmd+Option+I` (Mac)
- Abra a aba **Console** para ver todos os logs

### 2. **Em Produção (Build)**

Por padrão, o Tauri **não mostra** DevTools em builds de produção. Aqui estão as opções:

#### **Opção A: Habilitar DevTools no Build (Temporário para Debug)**

Adicione `devtools: true` na configuração da janela:

**Arquivo:** `src-tauri/tauri.conf.json`

```json
{
  "app": {
    "windows": [
      {
        "title": "firstapp",
        "width": 1500,
        "height": 800,
        "resizable": false,
        "center": true,
        "devtools": true
      }
    ]
  }
}
```

Depois disso, faça um novo build:
```bash
npm run tauri build
```

Agora você pode abrir DevTools com `F12` no app buildado.

⚠️ **IMPORTANTE:** Remova `"devtools": true` antes de distribuir o app para produção!

#### **Opção B: Ver Logs no Terminal (Windows)**

No Windows, você pode ver os logs do Rust no terminal, mas os logs do JavaScript não aparecem automaticamente.

**Solução:** Adicione um arquivo de log ou use `println!` no Rust para debugar.

#### **Opção C: Salvar Logs em Arquivo**

Crie uma função para salvar logs em arquivo:

```typescript
// src/utils/logger.ts
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

export async function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  try {
    await writeTextFile('app.log', logMessage, {
      append: true,
      dir: BaseDirectory.AppData
    });
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}
```

### 3. **Usar Console do Sistema (Windows)**

No Windows, você pode ver alguns logs no **Event Viewer** (Visualizador de Eventos), mas não é muito útil para logs do JavaScript.

## 🔧 Configuração Recomendada para Debug

### Habilitar DevTools Apenas em Debug

Modifique `tauri.conf.json` para habilitar DevTools apenas quando não estiver em release:

**Arquivo:** `src-tauri/tauri.conf.json`

```json
{
  "app": {
    "windows": [
      {
        "title": "firstapp",
        "width": 1500,
        "height": 800,
        "resizable": false,
        "center": true
      }
    ]
  }
}
```

E adicione código no Rust para abrir DevTools apenas em debug:

**Arquivo:** `src-tauri/src/main.rs`

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            start_oauth_listener,
            open_discord_oauth
        ])
        .run(tauri::generate_context!())
        .expect("erro ao rodar aplicação tauri");
}
```

Isso abrirá DevTools automaticamente em modo debug, mas não em release.

## 📝 Comandos Úteis

### Ver Logs em Desenvolvimento
```bash
npm run tauri dev
```
- Logs aparecem no terminal
- Pressione `F12` para abrir DevTools

### Build com DevTools Habilitado (para debug)
```bash
# 1. Adicione "devtools": true no tauri.conf.json
# 2. Faça o build
npm run tauri build

# 3. Execute o app e pressione F12
```

### Build de Produção (sem DevTools)
```bash
# Certifique-se de que "devtools": true NÃO está no tauri.conf.json
npm run tauri build
```

## 🎯 Para o Seu Caso Específico

Para debugar o problema de requisições HTTP:

1. **Habilite DevTools temporariamente** no `tauri.conf.json`:
   ```json
   {
     "app": {
       "windows": [
         {
           "devtools": true
         }
       ]
     }
   }
   ```

2. **Faça um novo build**:
   ```bash
   npm run tauri build
   ```

3. **Execute o app** e pressione `F12`

4. **Procure pelos logs** que começam com:
   - `[universalFetch]`
   - `[AuthContext]`
   - `[getBackendUrl]`

5. **Copie os logs** e compartilhe para diagnóstico

## 🔍 O Que Procurar nos Logs

Procure por estas mensagens:

```
✅ Funcionando:
[universalFetch] Detecção Tauri: { result: true, ... }
[universalFetch] Detectado Tauri, usando plugin HTTP
[universalFetch] Resposta recebida: { status: 200, ok: true }

❌ Problemas:
[universalFetch] Usando fetch nativo (não está no Tauri)
[universalFetch] Erro ao usar Tauri HTTP: ...
[getBackendUrl] VITE_BACKEND_URL: undefined
```

## 💡 Dica Extra: Atalho de Teclado

Você pode adicionar um atalho de teclado para abrir DevTools mesmo em produção (apenas para debug):

```rust
// No main.rs, adicione:
.setup(|app| {
    let window = app.get_webview_window("main").unwrap();
    
    // Atalho Ctrl+Shift+I para abrir DevTools (mesmo em release)
    window.listen("keydown", |event| {
        // Implementar lógica de atalho se necessário
    });
    
    Ok(())
})
```

Mas a forma mais simples é adicionar `"devtools": true` temporariamente no `tauri.conf.json`.
