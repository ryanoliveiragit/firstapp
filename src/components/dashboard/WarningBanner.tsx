import { AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';

export function WarningBanner() {
  return (
    <Card className="flex items-start gap-3 p-4 border border-white/25  rounded-lg animate-fade-in-up transition-all duration-300">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
      <div className="space-y-1">
        <p className="text-sm font-medium ">Crie um ponto de restauração</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Modificações no registro podem afetar o sistema. Recomendamos criar um backup antes.
        </p>
      </div>
    </Card>
  );
}
