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
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="space-y-2">
          <div className="glow-pill w-fit">
            <span className="glow-dot" />
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              Painel {currentTab?.title}
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
