import { Badge } from '@/components/ui/badge';
import { Zap, Activity, Rocket } from 'lucide-react';

interface OptimizationLevelBadgeProps {
  level: 'basica' | 'intermediaria' | 'avancada';
}

const levelConfig = {
  basica: {
    label: 'Básico',
    icon: Activity,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    glowColor: 'bg-blue-500/20',
  },
  intermediaria: {
    label: 'Intermediário',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    glowColor: 'bg-yellow-500/20',
  },
  avancada: {
    label: 'Avançado',
    icon: Rocket,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glowColor: 'bg-purple-500/20',
  },
};

export function OptimizationLevelBadge({ level }: OptimizationLevelBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
      <div className="glass-panel rounded-xl p-4 relative overflow-hidden">
        <div className={`absolute inset-0 ${config.glowColor} blur-xl opacity-20`} />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.color} border`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Nível Ativo</p>
              <p className="text-sm font-semibold">{config.label}</p>
            </div>
          </div>
          <Badge className={`${config.color} border px-3 py-1 text-xs font-medium`}>
            Ativo
          </Badge>
        </div>
      </div>
    </div>
  );
}
