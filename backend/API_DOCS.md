# 📚 Documentação da API - FirstApp Backend

## 🌐 Acesso à Documentação Interativa

A documentação interativa da API está disponível através do Swagger UI:

- **Desenvolvimento**: http://localhost:3000/api/docs
- **Produção**: https://firstapp-3y74.onrender.com/api/docs

## 📋 Endpoints Disponíveis

### 🔐 Autenticação (`/api/auth`)

#### POST `/api/auth/validate`

Valida uma chave de licença e retorna informações do usuário se válida.

**Request Body:**
```json
{
  "key": "ABCD-1234-EFGH-5678"
}
```

**Response (Sucesso):**
```json
{
  "valid": true,
  "userId": "user-123",
  "key": "ABCD-1234-EFGH-5678",
  "message": "Chave válida"
}
```

**Response (Erro):**
```json
{
  "valid": false,
  "message": "Chave inválida ou expirada"
}
```

**Status Codes:**
- `200 OK` - Requisição processada (sucesso ou erro)

---

#### POST `/api/auth/validate-stream`

Valida uma chave de licença usando Server-Sent Events (SSE) para retornar mensagens progressivas.

**⚠️ Nota:** Este endpoint retorna eventos no formato `text/event-stream`. Recomendado para web/dev, pode não funcionar bem no Tauri devido a limitações do plugin HTTP.

**Request Body:**
```json
{
  "key": "ABCD-1234-EFGH-5678"
}
```

**Response (Stream):**
```
data: {"type":"progress","message":"Analisando formato da chave..."}

data: {"type":"progress","message":"Conectando ao banco de dados..."}

data: {"type":"success","result":{"valid":true,"userId":"user-123","key":"ABCD-1234-EFGH-5678"}}
```

**Status Codes:**
- `200 OK` - Stream iniciado

---

### 👨‍💼 Administração (`/api/admin/keys`)

#### POST `/api/admin/keys`

Cria uma nova chave de licença.

**Request Body:**
```json
{
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1
}
```

**Todos os campos são opcionais:**
- Se `key` não for fornecida, será gerada automaticamente
- `isValid` padrão: `true`
- `maxUses` padrão: `1`

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1,
  "usedCount": 0
}
```

**Status Codes:**
- `201 Created` - Chave criada com sucesso
- `400 Bad Request` - Dados inválidos

---

#### GET `/api/admin/keys`

Lista todas as chaves de licença.

**Response:**
```json
[
  {
    "id": "uuid-1",
    "key": "ABCD-1234-EFGH-5678",
    "isValid": true,
    "userId": "user-123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "maxUses": 1,
    "usedCount": 0
  },
  {
    "id": "uuid-2",
    "key": "WXYZ-9876-STUV-5432",
    "isValid": false,
    "userId": null,
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "expiresAt": null,
    "maxUses": 1,
    "usedCount": 1
  }
]
```

**Status Codes:**
- `200 OK` - Lista retornada com sucesso

---

#### GET `/api/admin/keys/:id`

Busca uma chave de licença por ID (UUID).

**Parâmetros:**
- `id` (path) - UUID da chave

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1,
  "usedCount": 0
}
```

**Status Codes:**
- `200 OK` - Chave encontrada
- `404 Not Found` - Chave não encontrada

---

#### GET `/api/admin/keys/key/:key`

Busca uma chave de licença pelo valor da chave.

**Parâmetros:**
- `key` (path) - Valor da chave de licença

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1,
  "usedCount": 0
}
```

**Status Codes:**
- `200 OK` - Chave encontrada
- `404 Not Found` - Chave não encontrada

---

#### PATCH `/api/admin/keys/:id`

Atualiza uma chave de licença.

**Parâmetros:**
- `id` (path) - UUID da chave

**Request Body (todos os campos são opcionais):**
```json
{
  "key": "NEW-KEY-1234-5678",
  "isValid": false,
  "userId": "user-456",
  "expiresAt": "2026-12-31T23:59:59.000Z",
  "maxUses": 5,
  "usedCount": 2,
  "usedBy": "user-789"
}
```

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "NEW-KEY-1234-5678",
  "isValid": false,
  "userId": "user-456",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-03T00:00:00.000Z",
  "expiresAt": "2026-12-31T23:59:59.000Z",
  "maxUses": 5,
  "usedCount": 2,
  "usedBy": "user-789"
}
```

**Status Codes:**
- `200 OK` - Chave atualizada com sucesso
- `404 Not Found` - Chave não encontrada

---

#### DELETE `/api/admin/keys/:id`

Deleta uma chave de licença.

**Parâmetros:**
- `id` (path) - UUID da chave

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1,
  "usedCount": 0
}
```

**Status Codes:**
- `200 OK` - Chave deletada com sucesso
- `404 Not Found` - Chave não encontrada

---

#### POST `/api/admin/keys/:id/reset`

Reseta o uso de uma chave de licença (zera `usedCount` e limpa `usedBy`).

**Parâmetros:**
- `id` (path) - UUID da chave

**Response:**
```json
{
  "id": "uuid-da-chave",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-03T00:00:00.000Z",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "maxUses": 1,
  "usedCount": 0,
  "usedBy": null
}
```

**Status Codes:**
- `200 OK` - Uso da chave resetado com sucesso
- `404 Not Found` - Chave não encontrada

---

## 🔧 Modelos de Dados

### LicenseKey

```typescript
{
  id: string;           // UUID
  key: string;          // Chave de licença (formato: XXXX-XXXX-XXXX-XXXX)
  isValid: boolean;     // Se a chave está válida
  userId: string | null; // ID do usuário associado
  createdAt: Date;      // Data de criação
  updatedAt: Date;      // Data da última atualização
  expiresAt: Date | null; // Data de expiração
  lastUsedAt: Date | null; // Data do último uso
  maxUses: number;      // Número máximo de usos (padrão: 1)
  usedCount: number;    // Contador de usos
  usedBy: string | null; // ID do usuário que usou a chave
}
```

### ValidateKeyDto

```typescript
{
  key: string;  // Chave de licença (mínimo 1 caractere)
}
```

### CreateKeyDto

```typescript
{
  key?: string;        // Opcional (gerada automaticamente se não fornecida)
  isValid?: boolean;   // Padrão: true
  userId?: string;    // Opcional
  expiresAt?: string; // ISO 8601, opcional
  maxUses?: number;   // Mínimo: 1, Máximo: 1000, Padrão: 1
}
```

### UpdateKeyDto

```typescript
{
  key?: string;        // Opcional
  isValid?: boolean;   // Opcional
  userId?: string;    // Opcional
  expiresAt?: string; // ISO 8601, opcional
  maxUses?: number;   // Mínimo: 1, Máximo: 1000, opcional
  usedCount?: number; // Mínimo: 0, opcional
  usedBy?: string | null; // Opcional
}
```

---

## 🚀 Como Usar a Documentação Swagger

1. **Inicie o servidor:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Acesse a documentação:**
   - Abra http://localhost:3000/api/docs no navegador

3. **Teste os endpoints:**
   - Clique em um endpoint para expandir
   - Clique em "Try it out"
   - Preencha os parâmetros necessários
   - Clique em "Execute"
   - Veja a resposta

---

## 📝 Notas Importantes

### Validação de Chaves

- As chaves são normalizadas automaticamente (removem hífens e espaços, convertem para maiúsculas)
- O formato esperado é: `XXXX-XXXX-XXXX-XXXX` (16 caracteres alfanuméricos)
- Uma chave é considerada inválida se:
  - Não existe no banco de dados
  - `isValid` é `false`
  - Já foi usada (`usedCount >= maxUses`)
  - Está expirada (`expiresAt < agora`)

### CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:1420` (desenvolvimento)
- `tauri://localhost` (Tauri desktop app)
- Origens configuradas via variável de ambiente `CORS_ORIGIN`

### Formato de Data

Todas as datas devem estar no formato ISO 8601:
```
2025-12-31T23:59:59.000Z
```

---

## 🔗 Links Úteis

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api
- **Produção**: https://firstapp-3y74.onrender.com/api

---

## 📞 Suporte

Para mais informações, consulte:
- `README.md` - Documentação geral do backend
- `TROUBLESHOOTING.md` - Solução de problemas
- `ADMIN_API.md` - Documentação específica da API administrativa
