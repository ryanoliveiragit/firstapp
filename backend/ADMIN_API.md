# 🔐 API Admin - Gerenciamento de Chaves

API REST completa para gerenciar chaves de licença.

## 📡 Endpoints

### Base URL
```
http://localhost:3000/api/admin/keys
```

## 🚀 Rotas Disponíveis

### 1. Criar Nova Chave
**POST** `/api/admin/keys`

Cria uma nova chave de licença.

**Request Body:**
```json
{
  "key": "ABCD-1234-EFGH-5678",  // Opcional - se não fornecido, será gerado automaticamente
  "isValid": true,                // Opcional - padrão: true
  "userId": "user-123",           // Opcional
  "expiresAt": "2026-12-31T23:59:59Z",  // Opcional - formato ISO
  "maxUses": 1                    // Opcional - padrão: 1 (limite de 1 uso)
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2026-01-05T22:00:00Z",
  "updatedAt": "2026-01-05T22:00:00Z",
  "expiresAt": "2026-12-31T23:59:59Z",
  "lastUsedAt": null,
  "maxUses": 1,
  "usedCount": 0,
  "usedBy": null
}
```

**Exemplo sem chave (gera automaticamente):**
```json
{
  "maxUses": 1,
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

---

### 2. Listar Todas as Chaves
**GET** `/api/admin/keys`

Retorna todas as chaves cadastradas, ordenadas por data de criação (mais recentes primeiro).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "key": "ABCD-1234-EFGH-5678",
    "isValid": true,
    "userId": "user-123",
    "createdAt": "2026-01-05T22:00:00Z",
    "updatedAt": "2026-01-05T22:00:00Z",
    "expiresAt": "2026-12-31T23:59:59Z",
    "lastUsedAt": null,
    "maxUses": 1,
    "usedCount": 0,
    "usedBy": null
  }
]
```

---

### 3. Buscar Chave por ID
**GET** `/api/admin/keys/:id`

Busca uma chave específica pelo ID.

**Response (200):**
```json
{
  "id": "uuid",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2026-01-05T22:00:00Z",
  "updatedAt": "2026-01-05T22:00:00Z",
  "expiresAt": "2026-12-31T23:59:59Z",
  "lastUsedAt": null,
  "maxUses": 1,
  "usedCount": 0,
  "usedBy": null
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Chave não encontrada"
}
```

---

### 4. Buscar Chave por Valor
**GET** `/api/admin/keys/key/:key`

Busca uma chave pelo seu valor (com ou sem hífens).

**Exemplo:**
```
GET /api/admin/keys/key/ABCD-1234-EFGH-5678
GET /api/admin/keys/key/ABCD1234EFGH5678
```

**Response (200):** Mesmo formato da busca por ID

---

### 5. Atualizar Chave
**PATCH** `/api/admin/keys/:id`

Atualiza uma chave existente. Todos os campos são opcionais.

**Request Body:**
```json
{
  "key": "NEW-KEY-1234-5678",     // Opcional
  "isValid": false,               // Opcional
  "userId": "new-user-456",       // Opcional
  "expiresAt": "2027-12-31T23:59:59Z",  // Opcional
  "maxUses": 5,                   // Opcional
  "usedCount": 0,                 // Opcional
  "usedBy": null                  // Opcional - null para resetar
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "key": "NEW-KEY-1234-5678",
  "isValid": false,
  "userId": "new-user-456",
  "createdAt": "2026-01-05T22:00:00Z",
  "updatedAt": "2026-01-05T22:30:00Z",
  "expiresAt": "2027-12-31T23:59:59Z",
  "lastUsedAt": null,
  "maxUses": 5,
  "usedCount": 0,
  "usedBy": null
}
```

---

### 6. Deletar Chave
**DELETE** `/api/admin/keys/:id`

Remove uma chave do banco de dados.

**Response (200):**
```json
{
  "message": "Chave deletada com sucesso",
  "key": "ABCD-1234-EFGH-5678"
}
```

---

### 7. Resetar Uso da Chave
**POST** `/api/admin/keys/:id/reset`

Reseta o uso de uma chave, permitindo que seja reutilizada.

**Response (200):**
```json
{
  "id": "uuid",
  "key": "ABCD-1234-EFGH-5678",
  "isValid": true,
  "userId": "user-123",
  "createdAt": "2026-01-05T22:00:00Z",
  "updatedAt": "2026-01-05T22:35:00Z",
  "expiresAt": "2026-12-31T23:59:59Z",
  "lastUsedAt": null,
  "maxUses": 1,
  "usedCount": 0,
  "usedBy": null
}
```

---

## 📋 Campos da Chave

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (UUID) | Identificador único |
| `key` | String | Chave de licença (formato: XXXX-XXXX-XXXX-XXXX) |
| `isValid` | Boolean | Se a chave está ativa |
| `userId` | String? | ID do usuário associado (opcional) |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Data da última atualização |
| `expiresAt` | DateTime? | Data de expiração (null = nunca expira) |
| `lastUsedAt` | DateTime? | Data do último uso |
| `maxUses` | Int | Limite máximo de usos (padrão: 1) |
| `usedCount` | Int | Quantidade de vezes que foi usada |
| `usedBy` | String? | Identificador de quem usou a chave (null = não usada) |

## 🔒 Limitação de Uso

- **Padrão**: Cada chave pode ser usada apenas **1 vez** (`maxUses: 1`)
- Quando uma chave é usada:
  - `usedCount` é incrementado
  - `usedBy` recebe um ID único do usuário
  - `lastUsedAt` é atualizado
- Uma chave que já foi usada (`usedBy !== null`) **não pode ser reutilizada**
- Use o endpoint `/reset` para permitir reutilização

## 🧪 Exemplos de Uso

### Criar chave com expiração de 24h
```bash
curl -X POST http://localhost:3000/api/admin/keys \
  -H "Content-Type: application/json" \
  -d '{
    "maxUses": 1,
    "expiresAt": "2026-01-06T22:00:00Z"
  }'
```

### Listar todas as chaves
```bash
curl http://localhost:3000/api/admin/keys
```

### Desativar uma chave
```bash
curl -X PATCH http://localhost:3000/api/admin/keys/{id} \
  -H "Content-Type: application/json" \
  -d '{"isValid": false}'
```

### Resetar uso de uma chave
```bash
curl -X POST http://localhost:3000/api/admin/keys/{id}/reset
```

### Deletar uma chave
```bash
curl -X DELETE http://localhost:3000/api/admin/keys/{id}
```

## ⚠️ Notas Importantes

1. **Unicidade**: Cada chave deve ser única no banco
2. **Formato**: As chaves são normalizadas automaticamente (hífens são adicionados/removidos conforme necessário)
3. **Uso Único**: Por padrão, cada chave só pode ser usada uma vez
4. **Reset**: Use o endpoint `/reset` para permitir que uma chave seja reutilizada
