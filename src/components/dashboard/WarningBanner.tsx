import { AlertCircle } from 'lucide-react';

export function WarningBanner() {
  return (
    <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-yellow-500">Crie um ponto de restauração</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Modificações no registro podem afetar o sistema. Recomendamos criar um backup antes.
        </p>
      </div>
    </div>
  );
}
