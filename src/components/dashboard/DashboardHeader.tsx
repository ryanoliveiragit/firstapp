import { UserBadge } from './UserBadge';

interface User {
  id: string;
  username: string;
  avatar?: string;
  discriminator?: string;
  email?: string;
}

interface DashboardHeaderProps {
  activeTab: string;
  user: User | null;
}

const tabTitles = {
  optimizations: {
    title: 'Otimizações',
    description: 'Selecione o nível de ajustes e aplique melhorias'
  },
  utilities: {
    title: 'Utilitários',
    description: 'Ferramentas adicionais para rede, GPU e manutenção'
  },
  status: {
    title: 'Status do Sistema',
    description: 'Monitore o desempenho em tempo real'
  },
  config: {
    title: 'Configurações',
    description: 'Personalize suas preferências'
  },
  profile: {
    title: 'Perfil',
    description: 'Informações da sua conta'
  }
};

export function DashboardHeader({ activeTab, user }: DashboardHeaderProps) {
  const currentTab = tabTitles[activeTab as keyof typeof tabTitles];

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 overflow-hidden relative">
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/65 to-transparent" />
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="space-y-2">
          <div className="glow-pill w-fit">
           <span className="relative inline-flex">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
</span>
            <span className="text-[11px] tracking-[0.08em] text-green-500">
              Sua sessão esta ativa
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentTab?.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentTab?.description}
            </p>
          </div>
        </div>
        <UserBadge user={user} />
      </div>
    </div>
  );
}
