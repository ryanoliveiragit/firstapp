import { Card, CardContent } from '@/components/ui/card';
import { Gauge, Play, Activity, CheckCircle2 } from 'lucide-react';

interface FPSBoostCardProps {
  isApplying: boolean;
  onApply: () => void;
}

const features = [
  'Desativa recursos visuais desnecessários',
  'Otimiza prioridade de processos de jogo',
  'Reduz latência de entrada (Input Lag)',
];

export function FPSBoostCard({ isApplying, onApply }: FPSBoostCardProps) {
  return (
    <Card className="group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
              <Gauge className="w-6 h-6 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">FPS Boost</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Otimizações de registro para aumentar FPS em jogos
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
            onClick={onApply}
            disabled={isApplying}
            className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <Activity className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Aplicando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Executar Tweak
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
