# 🧪 Como Testar o Backend no Build

## Problema
O `.env` está correto, mas o backend ainda não funciona no build.

## 🔍 Diagnóstico Automático

Criei um teste automático que será executado quando o app iniciar.

### Para Ativar o Teste

Adicione ao `.env`:
```env
VITE_ENABLE_BACKEND_TEST=true
```

Ou o teste já roda automaticamente em modo desenvolvimento.

### O Que o Teste Mostra

O teste mostrará no console (F12):

1. **Variáveis de ambiente:**
   - `VITE_BACKEND_URL`
   - Modo (DEV/PROD)
   
2. **Detecção do Tauri:**
   - Se está detectando o Tauri corretamente
   - Qual fetch está sendo usado

3. **Requisição de teste:**
   - URL sendo usada
   - Status da resposta
   - Tempo de resposta
   - Corpo da resposta

## 📊 Interpretando os Resultados

### ✅ Se o teste passar:
```
✅ [testBackend] SUCESSO! Backend está funcionando!
```
- O backend está funcionando
- O problema pode estar em outro lugar

### ❌ Se o teste falhar:

#### Erro: "Usando fetch nativo"
```
[universalFetch] Usando fetch nativo (não está no Tauri)
```
**Problema:** O Tauri não está sendo detectado
**Solução:** Verificar se está rodando o build do Tauri, não o dev server

#### Erro: "Permission denied"
```
[universalFetch] Erro ao usar Tauri HTTP: Permission denied
```
**Problema:** Permissões HTTP não configuradas
**Solução:** Verificar `capabilities/default.json`

#### Erro: "Failed to fetch" ou "Network error"
```
[universalFetch] Erro ao usar Tauri HTTP: Network error
```
**Problema:** 
- Backend não está acessível
- URL incorreta
- Firewall bloqueando

**Solução:** 
- Verificar se o backend está rodando
- Testar a URL no navegador
- Verificar firewall

## 🎯 Próximos Passos

1. **Faça um novo build:**
   ```bash
   npm run tauri build
   ```

2. **Execute o app** e pressione `F12`

3. **Procure pelos logs** que começam com `🧪 [testBackend]`

4. **Compartilhe os logs completos** para diagnóstico

## 📝 Logs Esperados

### Funcionando:
```
🧪 [testBackend] Iniciando teste de conexão...
🧪 [testBackend] Backend URL: https://firstapp-3y74.onrender.com
🧪 [testBackend] VITE_BACKEND_URL: https://firstapp-3y74.onrender.com
[universalFetch] Detecção Tauri: { result: true, ... }
[universalFetch] Detectado Tauri, usando plugin HTTP
🧪 [testBackend] Resposta recebida em X ms
🧪 [testBackend] Status: 200 OK
✅ [testBackend] SUCESSO! Backend está funcionando!
```

### Com Problema:
```
🧪 [testBackend] Backend URL: http://127.0.0.1:3000
🧪 [testBackend] VITE_BACKEND_URL: undefined
❌ [testBackend] ERRO: ...
```

## 💡 Dica

Se o teste passar mas o login ainda não funcionar, o problema pode estar no código de autenticação, não nas requisições HTTP.
