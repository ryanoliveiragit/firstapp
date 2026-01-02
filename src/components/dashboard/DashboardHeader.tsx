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
  regedits: {
    title: 'Registry Tweaks',
    description: 'Otimizações de registro do sistema'
  },
  exec: {
    title: 'Executáveis',
    description: 'Utilitários e ferramentas de sistema'
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
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {currentTab?.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentTab?.description}
        </p>
      </div>
      <UserBadge user={user} />
    </div>
  );
}
