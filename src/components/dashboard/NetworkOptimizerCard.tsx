import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Check, Wifi } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface NetworkOptimizerCardProps {
  isExecuting: boolean;
  onExecute: () => void;
}

const optimizations = [
  'Reconfigura parâmetros TCP para maior throughput',
  'Habilita RSS e desativa recursos que aumentam latência',
  'Limpa cache DNS e ARP para conexões frescas',
];

export function NetworkOptimizerCard({ isExecuting, onExecute }: NetworkOptimizerCardProps) {
  const [isEnabled, setIsEnabled] = useLocalStorage('network-optimizer-enabled', false);

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
              <Wifi className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Rede</CardTitle>
              <CardDescription>Otimizações para latência mais baixa</CardDescription>
            </div>
          </div>
          <div className="glow-pill bg-primary/10 border-primary/20">
            <span className="glow-dot bg-primary" />
            <span className="text-[11px] text-primary">Ping estável</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <ul className="space-y-2">
          {optimizations.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground border border-white/5 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="glow-dot" />
            Latência otimizada
          </span>
          <span className="text-foreground/80">~18s</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            {isExecuting && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-medium">
              {isExecuting ? 'Aplicando...' : isEnabled ? 'Ativo' : 'Otimizar rede'}
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
