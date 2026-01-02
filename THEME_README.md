# Paragon Tweaking Utility - Tema Futurista

Interface futurista com tema vermelho/preto piano inspirado em aplicações de tweaking e otimização de sistema.

## Características do Tema

### Paleta de Cores
- **Background**: Preto piano (#0a0a0a)
- **Primary**: Vermelho (#DC2626)
- **Secondary**: Cinza escuro (#1c1c1c)
- **Accent**: Vermelho brilhante para highlights

### Efeitos Visuais

#### 1. Grid Background
Fundo com grade futurista em padrão reticulado vermelho sutil.

#### 2. Scan Line Effect
Linha de varredura animada que percorre a tela verticalmente, simulando efeito CRT.

#### 3. Glow Effects
- **glow-red**: Efeito de brilho suave vermelho
- **glow-red-strong**: Efeito de brilho intenso
- **text-glow**: Brilho em texto

#### 4. Holographic Cards
Cards com efeito holográfico e animação de shimmer (reflexo deslizante).

## Componentes

### Shadcn/UI Customizados
- **Button**: Botões com efeito glow vermelho
- **Card**: Cards com efeito holográfico

### Componentes Futuristas
- **Dashboard**: Layout principal com sidebar e múltiplas seções
- **Sidebar**: Menu lateral com navegação e efeitos hover
- **StatsCard**: Cards de estatísticas com ícones e métricas
- **PerformanceMonitor**: Monitor de sistema em tempo real com barras de progresso animadas
- **Login**: Tela de login com visual futurista

## Animações

### Keyframes Customizados
```css
- pulse-glow: Pulsação de brilho vermelho
- scan-line: Linha de varredura vertical
- shimmer: Reflexo holográfico deslizante
```

## Estrutura de Componentes

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   ├── Login.tsx
│   ├── StatsCard.tsx
│   └── PerformanceMonitor.tsx
├── lib/
│   └── utils.ts
└── contexts/
    └── AuthContext.tsx
```

## Tecnologias Utilizadas

- **React 19**: Framework principal
- **Tailwind CSS**: Estilização
- **shadcn/ui**: Biblioteca de componentes base
- **Lucide React**: Ícones
- **Class Variance Authority (CVA)**: Variantes de componentes
- **Tailwind Merge**: Merge de classes CSS

## Customização

As cores do tema podem ser ajustadas em `src/index.css` nas variáveis CSS:

```css
:root {
  --background: 0 0% 5%;
  --primary: 0 72% 51%;
  --accent: 0 72% 51%;
  /* ... outras variáveis */
}
```

## Features

- ✅ Tema escuro futurista
- ✅ Efeitos de brilho e animações
- ✅ Grid pattern no fundo
- ✅ Scan line effect
- ✅ Cards holográficos
- ✅ Sidebar responsiva
- ✅ Monitor de performance em tempo real
- ✅ Autenticação Discord integrada
- ✅ Design system consistente
