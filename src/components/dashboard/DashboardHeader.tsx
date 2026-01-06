import { UserBadge } from "./UserBadge";
import { User } from "@/contexts/AuthContext";
import { CheckCircle2 } from "lucide-react";

interface DashboardHeaderProps {
  activeTab: string;
  user: User | null;
}

const tabTitles = {
  optimizations: {
    title: "Otimizações",
    description: "Selecione o nível de ajustes e aplique melhorias",
  },
  utilities: {
    title: "Utilitários",
    description: "Ferramentas adicionais para rede, GPU e manutenção",
  },
  status: {
    title: "Status do Sistema",
    description: "Monitore o desempenho em tempo real",
  },
  config: {
    title: "Configurações",
    description: "Personalize suas preferências",
  },
  profile: {
    title: "Perfil",
    description: "Informações da sua conta",
  },
};

export function DashboardHeader({ activeTab, user }: DashboardHeaderProps) {
  const currentTab = tabTitles[activeTab as keyof typeof tabTitles];

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-7 overflow-hidden relative border border-white/10 bg-gradient-to-r from-white/5 to-transparent">
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/65 to-transparent" />

      <div className="flex items-start justify-between gap-6 flex-wrap relative z-10">
        <div className="space-y-3">
          {/* Badge de Sessão Ativa */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider text-green-400 uppercase">
              Sessão Ativa
            </span>
          </div>

          {/* Título e Descrição */}
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-glow">
              {currentTab?.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentTab?.description}
            </p>
          </div>
        </div>

        {/* UserBadge */}
        <UserBadge user={user} />
      </div>
    </div>
  );
}
