import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Gpu, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

interface AutoGPUCardProps {
  isExecuting: boolean;
  onExecute: () => void;
}

const features = [
  'Detecta automaticamente fabricante da GPU',
  'Aplica configurações otimizadas de energia',
  'Configura perfil de alto desempenho',
  'Ajusta prioridades de renderização',
];

export function AutoGPUCard({ isExecuting, onExecute }: AutoGPUCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (checked) {
      onExecute();
    }
  };

  return (
    <Card className="card-hover animate-scale-in glass-panel glass-card h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20">
              <Gpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">GPU Config</CardTitle>
              <CardDescription>Configuração automática para Nvidia e AMD</CardDescription>
            </div>
          </div>
          <div className="glow-pill bg-primary/10 border-primary/20">
            <span className="glow-dot bg-primary" />
            <span className="text-[11px] text-primary">Auto-detect</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground border border-white/5 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="glow-dot" />
            Perfil alto desempenho
          </span>
          <span className="text-foreground/80">~20s</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            {isExecuting && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-medium">
              {isExecuting ? 'Executando...' : isEnabled ? 'Ativo' : 'Executar Configuração'}
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
