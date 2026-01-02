import { AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';

export function WarningBanner() {
  return (
    <Card className="glass-panel glass-card flex items-start gap-4 p-4 md:p-5 rounded-xl animate-fade-in-up transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/20">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="glow-pill w-fit">
          <span className="glow-dot" />
          <span className="text-[11px] text-muted-foreground">Recomendação</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-semibold">Crie um ponto de restauração</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Modificações no registro podem afetar o sistema. Recomendamos criar um backup antes.
          </p>
        </div>
      </div>
    </Card>
  );
}
