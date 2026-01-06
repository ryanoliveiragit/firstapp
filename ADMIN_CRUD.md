# Admin CRUD Interface

Interface completa de administração para gerenciar chaves de licença do sistema.

## 📁 Estrutura de Arquivos Criados

```
src/
├── services/
│   └── adminService.ts         # Serviço de API com métodos CRUD
├── components/
│   └── admin/
│       ├── AdminPanel.tsx      # Componente principal do painel admin
│       ├── KeyListTable.tsx    # Tabela de listagem de chaves
│       ├── CreateKeyModal.tsx  # Modal de criação de chaves
│       ├── EditKeyModal.tsx    # Modal de edição de chaves
│       └── DeleteConfirmDialog.tsx  # Dialog de confirmação de exclusão
```

## 🎨 Design System

A interface segue completamente o design system existente:

- ✅ **Glassmorphism**: `glass-panel` e `glass-card` para containers
- ✅ **Tema Dark**: Cores e contrastes do tema escuro atual
- ✅ **Animações**: `fade-in`, `scale-in`, `slide-in-left`
- ✅ **Tipografia**: Space Grotesk para UI
- ✅ **Ícones**: Lucide React (Database, Plus, Edit2, Trash2, etc)
- ✅ **Notificações**: Toast (Sonner) para feedback de ações

## 🚀 Funcionalidades

### 1. **Visualizar Chaves** (GET /api/admin/keys)
- Tabela completa com todas as chaves do sistema
- Busca por chave, userId ou usedBy
- Status visual: Ativa, Inválida, Expirada, Limite Atingido
- Badges com cores diferenciadas
- Barra de progresso de uso (usedCount/maxUses)
- Formatação de datas em PT-BR

### 2. **Criar Chave** (POST /api/admin/keys)
- Modal glassmorphism
- Campos:
  - Chave (opcional - auto-gerada se vazio)
  - User ID (opcional)
  - Máximo de Usos (obrigatório)
  - Data de Expiração (opcional)
  - Switch de Ativação
- Validação de formulário
- Feedback visual de loading

### 3. **Editar Chave** (PATCH /api/admin/keys/:id)
- Modal com dados pré-preenchidos
- Campos editáveis:
  - Chave
  - User ID
  - Used By
  - Máximo de Usos
  - Usos Atuais
  - Data de Expiração
  - Status (válida/inválida)
- Metadados read-only (createdAt, updatedAt, lastUsedAt)
- ID da chave não editável

### 4. **Excluir Chave** (DELETE /api/admin/keys/:id)
- Dialog de confirmação com estilo destrutivo
- Exibe ID da chave a ser excluída
- Ação irreversível com aviso claro

### 5. **Resetar Uso** (POST /api/admin/keys/:id/reset)
- Botão na tabela para resetar contador de uso
- Feedback via toast
- Atualização instantânea da tabela

## 🔌 API Service

O `adminService.ts` fornece métodos tipados:

```typescript
// Listar todas as chaves
adminService.getAllKeys(): Promise<LicenseKey[]>

// Buscar por ID
adminService.getKeyById(id: string): Promise<LicenseKey>

// Buscar por valor da chave
adminService.getKeyByValue(key: string): Promise<LicenseKey>

// Criar nova chave
adminService.createKey(data: CreateKeyDto): Promise<LicenseKey>

// Atualizar chave
adminService.updateKey(id: string, data: UpdateKeyDto): Promise<LicenseKey>

// Excluir chave
adminService.deleteKey(id: string): Promise<void>

// Resetar uso
adminService.resetKeyUsage(id: string): Promise<LicenseKey>
```

## 🎯 Integração

### Sidebar
Novo item no menu:
- **ID**: `admin`
- **Label**: "Admin"
- **Ícone**: Database (Lucide)
- **Posição**: Entre "Status" e "Configurações"

### Dashboard
Renderiza `<AdminPanel />` quando `activeTab === "admin"`

## 🎨 Componentes Visuais

### AdminPanel
- Header com ícone Database
- Contador de chaves
- Botões "Atualizar" e "Nova Chave"
- Estado de loading com spinner
- Estado vazio com call-to-action

### KeyListTable
- Tabela responsiva com scroll horizontal
- Busca em tempo real
- Colunas:
  1. Chave (com botão copiar)
  2. Status (badge colorido)
  3. Uso (contador + barra de progresso)
  4. User ID
  5. Criada Em
  6. Expira Em
  7. Ações (Reset, Edit, Delete)
- Footer com contador de resultados

### Modals
- Backdrop com blur
- Animação de scale-in
- Glassmorphism panel
- Botões de ação alinhados
- Loading states

## 🌐 Variáveis de Ambiente

O serviço usa a variável:
```bash
VITE_API_URL=http://localhost:3000/api
```

Se não definida, usa o fallback: `http://localhost:3000/api`

## 🚦 Como Usar

1. **Acessar o Admin**
   - Fazer login no sistema
   - Clicar em "Admin" no sidebar

2. **Criar uma Chave**
   - Clicar em "Nova Chave"
   - Preencher formulário (chave é opcional)
   - Submeter

3. **Editar uma Chave**
   - Clicar no ícone de lápis na linha da chave
   - Modificar campos desejados
   - Salvar alterações

4. **Resetar Uso**
   - Clicar no ícone de reload na linha da chave
   - Contador volta para 0

5. **Excluir uma Chave**
   - Clicar no ícone de lixeira
   - Confirmar exclusão no dialog

## 📱 Responsividade

- Tabela com scroll horizontal em telas pequenas
- Modals adaptáveis ao tamanho da tela
- Grid responsivo para ações

## 🎭 Estados e Feedback

- **Loading**: Spinners nos botões e tela principal
- **Success**: Toast verde com mensagem de sucesso
- **Error**: Toast vermelho com mensagem de erro
- **Empty State**: Tela vazia com call-to-action
- **Copy**: Feedback visual ao copiar chave

## 🔐 Segurança

⚠️ **IMPORTANTE**: Esta interface não possui autenticação/autorização própria.

Recomendações para produção:
- Adicionar autenticação admin
- Implementar RBAC (Role-Based Access Control)
- Proteger rotas admin no backend
- Adicionar rate limiting
- Logs de auditoria

## 🎨 Melhorias Futuras

- [ ] Paginação para grandes volumes de dados
- [ ] Filtros avançados (status, datas, etc)
- [ ] Exportação de dados (CSV, JSON)
- [ ] Estatísticas e dashboards
- [ ] Histórico de alterações
- [ ] Bulk operations (criar/editar/excluir múltiplas chaves)
- [ ] Autenticação admin dedicada

## 🛠️ Dependências Utilizadas

Todas as dependências já existiam no projeto:
- React 19.1.0
- TypeScript 5.8.3
- Lucide React (ícones)
- Sonner (toasts)
- Tailwind CSS (estilos)
- shadcn/ui (componentes base: Badge, Input, Label, Switch)

## 📝 Notas

- Backend já estava 100% implementado (`/backend/src/admin/`)
- Esta implementação adiciona apenas o frontend
- Design segue exatamente o padrão existente
- Totalmente integrado ao sistema atual
