import { Card, CardContent } from '@/components/ui/card';
import { Gpu, Play, Activity, CheckCircle2 } from 'lucide-react';

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
  return (
    <Card className="group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
              <Gpu className="w-6 h-6 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">Auto GPU Config Nvidia/AMD</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configuração automática de GPU para Nvidia e AMD
              </p>
            </div>
          </div>

          <div className="space-y-2 py-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <>
                <Activity className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Executar Configuração
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
