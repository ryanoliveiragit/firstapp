# 🚀 Quick Start Guide - Paragon Tweaking Utility

## ✅ Tudo Está Funcionando!

Tailwind CSS v3.4 + shadcn/ui + Tema Futurista Vermelho/Preto

## 📦 Instalação

Se você clonou o repositório recentemente:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e adicione seu DISCORD_CLIENT_ID
```

## ⚙️ Configuração Discord OAuth

1. Acesse https://discord.com/developers/applications
2. Crie uma nova aplicação
3. Vá em "OAuth2" → "Redirects"
4. Adicione: `http://localhost:1420/callback`
5. Copie o "CLIENT ID"
6. Cole no arquivo `.env`:
   ```
   VITE_DISCORD_CLIENT_ID=seu_client_id_aqui
   VITE_DISCORD_REDIRECT_PORT=1420
   ```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```
Abra: http://localhost:1420

### Build de Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 🎨 Recursos

### Tema Futurístico
- ✅ Fundo preto piano (#0a0a0a)
- ✅ Vermelho vibrante (#DC2626)
- ✅ Grid pattern animado
- ✅ Scan line effect (CRT)
- ✅ Efeitos de brilho (glow)
- ✅ Cards holográficos

### Componentes
- ✅ Dashboard completo
- ✅ Sidebar com navegação
- ✅ Performance Monitor
- ✅ Stats Cards
- ✅ Login futurístico
- ✅ Autenticação Discord

### Tecnologias
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v3.4
- ✅ shadcn/ui
- ✅ Tauri (Desktop)
- ✅ Vite

## 🧪 Testar Componentes

Para visualizar todos os componentes e estilos, use a página de teste:

1. Abra `src/App.tsx`
2. Substitua temporariamente:
   ```tsx
   import TestPage from "./components/TestPage";

   function App() {
     return <TestPage />;
   }
   ```
3. Execute `npm run dev`
4. Você verá todos os componentes, cores e animações

## 🔧 Troubleshooting

### Erro "Cannot find module 'tailwindcss-animate'"

```bash
# Limpar cache e reinstalar
rm -rf node_modules/.vite dist
npm install
npm run build
```

### Tailwind não está aplicando estilos

Verifique se `src/main.tsx` tem:
```tsx
import "./index.css";
```

### Build falha

```bash
# Verificar versão do Tailwind
npm list tailwindcss
# Deve ser: tailwindcss@3.4.x

# Se for v4.x, reinstalar v3:
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0
```

### Dev server não inicia

```bash
# Verificar se a porta 1420 está livre
lsof -i :1420  # macOS/Linux
netstat -ano | findstr :1420  # Windows

# Ou mudar a porta em vite.config.ts
```

## 📁 Estrutura do Projeto

```
firstapp/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Login.tsx        # Login page
│   │   ├── PerformanceMonitor.tsx
│   │   ├── StatsCard.tsx
│   │   └── TestPage.tsx     # Test page
│   ├── contexts/
│   │   └── AuthContext.tsx  # Discord auth
│   ├── lib/
│   │   └── utils.ts         # cn() utility
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Tailwind + theme
├── .env                    # Your config
├── .env.example           # Template
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
├── vite.config.ts         # Vite config
└── package.json

```

## 🎯 Próximos Passos

1. ✅ Configure suas credenciais Discord no `.env`
2. ✅ Execute `npm run dev`
3. ✅ Faça login com Discord
4. ✅ Explore o dashboard futurístico!

## 📚 Documentação

- `DISCORD_AUTH_SETUP.md` - Configuração detalhada do Discord
- `THEME_README.md` - Documentação do tema futurístico
- `TAILWIND_FIX.md` - Detalhes técnicos da correção do Tailwind

## 🐛 Reportar Problemas

Se encontrar problemas:
1. Verifique a seção Troubleshooting acima
2. Limpe cache: `rm -rf node_modules/.vite dist`
3. Reinstale: `npm install`
4. Abra uma issue no repositório

## 🎉 Pronto!

Tudo está configurado e funcionando. Execute `npm run dev` e aproveite! 🚀
