# 🐛 Debug: Requisições de Rede não Funcionam no Build do Tauri

## Problema
Após fazer o build do Tauri, o aplicativo não consegue fazer requisições para a API. As requisições não chegam ao backend (não aparecem nos logs do servidor).

## Diagnóstico

### 1. Verificar se as Variáveis de Ambiente estão sendo Carregadas

As variáveis `VITE_*` são substituídas em **tempo de build**, não em tempo de execução. Isso significa que:

1. O arquivo `.env` deve estar na **raiz do projeto** (mesmo nível que `package.json`)
2. O build deve ser feito **após** configurar o `.env`
3. As variáveis são **embutidas no código JavaScript** durante o build

**Para verificar:**
1. Abra o DevTools do Tauri (se disponível) ou adicione logs no código
2. Verifique se `import.meta.env.VITE_BACKEND_URL` tem o valor correto
3. Os logs agora mostram: `[getBackendUrl] VITE_BACKEND_URL: ...`

### 2. Verificar o CSP (Content Security Policy)

O CSP do Tauri está configurado para permitir todas as conexões:
```json
"csp": "default-src 'self'; connect-src 'self' https: http: ws: wss:; ..."
```

**Se ainda não funcionar**, tente adicionar a URL específica:
```json
"csp": "default-src 'self'; connect-src 'self' https://firstapp-3y74.onrender.com https: http: ws: wss:; ..."
```

### 3. Verificar se o Fetch está Disponível

No Tauri, o `fetch` pode não estar disponível em alguns contextos. Os logs agora verificam isso:
- `[AuthContext] fetch disponível: true/false`

### 4. Verificar CORS do Backend

O backend deve aceitar requisições sem origem (apps desktop). O código já foi ajustado para isso.

**Verifique no backend:**
- O CORS está configurado para aceitar requisições sem origem
- O backend está rodando e acessível
- Teste a URL diretamente no navegador: `https://firstapp-3y74.onrender.com/api/auth/validate`

## Solução: Usar Tauri HTTP Client (Alternativa)

Se o `fetch` não funcionar no Tauri, podemos usar o cliente HTTP do Tauri. Mas primeiro, vamos diagnosticar o problema atual.

## Passos para Debug

### 1. Verificar Build
```bash
# Certifique-se de que o .env está correto
cat .env

# Faça um build limpo
npm run tauri build
```

### 2. Executar o App e Verificar Logs

1. Execute o app buildado
2. Abra o DevTools (se disponível) ou verifique os logs do sistema
3. Tente fazer login
4. Procure por logs que começam com `[AuthContext]` ou `[getBackendUrl]`

### 3. Verificar o que está sendo Logado

Os logs agora mostram:
- `[getBackendUrl] VITE_BACKEND_URL:` - Valor da variável de ambiente
- `[getBackendUrl] import.meta.env:` - Todo o objeto de ambiente
- `[AuthContext] Backend URL:` - URL final sendo usada
- `[AuthContext] Tentando conectar em:` - URL completa da API
- `[AuthContext] fetch disponível:` - Se fetch está disponível
- `[AuthContext] Resposta recebida em X ms` - Se a requisição foi feita

### 4. Testar a URL Manualmente

Abra o navegador e teste:
```bash
curl -X POST https://firstapp-3y74.onrender.com/api/auth/validate-stream \
  -H "Content-Type: application/json" \
  -d '{"key":"TEST-KEY-123456"}'
```

Ou use o Postman/Insomnia para testar a API diretamente.

## Possíveis Causas

1. **Variável de ambiente não carregada no build**
   - Solução: Verificar `.env` e fazer novo build

2. **CSP bloqueando requisições**
   - Solução: Já ajustado, mas pode precisar da URL específica

3. **Fetch não disponível no Tauri**
   - Solução: Usar Tauri HTTP client (precisa instalar plugin)

4. **Backend não está acessível**
   - Solução: Verificar se o backend está rodando e acessível

5. **Firewall/Antivírus bloqueando**
   - Solução: Adicionar exceção para o executável

## Próximos Passos

1. Execute o app buildado
2. Verifique os logs no console
3. Compartilhe os logs que começam com `[AuthContext]` ou `[getBackendUrl]`
4. Com base nos logs, podemos identificar o problema específico

## Logs Esperados

Se tudo estiver funcionando, você deve ver:
```
[getBackendUrl] VITE_BACKEND_URL: https://firstapp-3y74.onrender.com
[AuthContext] Backend URL: https://firstapp-3y74.onrender.com
[AuthContext] Tentando conectar em: https://firstapp-3y74.onrender.com/api/auth/validate-stream
[AuthContext] fetch disponível: true
[AuthContext] Iniciando fetch...
[AuthContext] Resposta recebida em X ms
```

Se não funcionar, você verá:
```
[getBackendUrl] VITE_BACKEND_URL: undefined
[AuthContext] Backend URL: http://127.0.0.1:3000 (fallback)
```

Ou:
```
[AuthContext] fetch disponível: false
[AuthContext] ERRO CRÍTICO: fetch não está disponível
```
