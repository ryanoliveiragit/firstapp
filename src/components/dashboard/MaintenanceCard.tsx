import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MaintenanceCardProps {
  isExecuting: boolean;
  onExecute: () => void;
}

const maintenanceTasks = [
  'Limpa pastas temporárias e cache do sistema',
  'Esvazia lixeira e remove arquivos obsoletos',
  'Atualiza cache DNS e remove registros ARP',
];

export function MaintenanceCard({ isExecuting, onExecute }: MaintenanceCardProps) {
  const [isEnabled, setIsEnabled] = useLocalStorage('maintenance-enabled', false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (checked) {
      onExecute();
    }
  };

  return (
    <Card className="card-hover animate-scale-in h-full flex flex-col glass-panel glass-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Limpeza Rápida</CardTitle>
              <CardDescription>Remove arquivos temporários e cache</CardDescription>
            </div>
          </div>
          <div className={`glow-pill ${isEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/10 border-muted/20'}`}>
            {isEnabled ? (
              <>
                <span className="relative inline-flex">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[11px] text-green-500">Higienização</span>
              </>
            ) : (
              <>
                <span className="glow-dot bg-muted" />
                <span className="text-[11px] text-muted-foreground">Higienização</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <ul className="space-y-2">
          {maintenanceTasks.map((task, index) => (
            <li
              key={task}
              className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground border border-white/5 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="glow-dot" />
            Libera espaço e cache
          </span>
          <span className="text-foreground/80">~30s</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            {isExecuting && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-medium">
              {isExecuting ? 'Executando...' : isEnabled ? 'Ativo' : 'Rodar limpeza'}
            </span>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isExecuting}
          />
        </div>
      </CardContent>
    </Card>
  );
}
