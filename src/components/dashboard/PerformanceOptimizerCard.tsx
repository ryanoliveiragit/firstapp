import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, Rocket } from 'lucide-react';

interface PerformanceOptimizerCardProps {
  isExecuting: boolean;
  onExecute: () => void;
}

const tweaks = [
  'Ativa plano de energia de alto desempenho',
  'Desliga hibernação e suspensões automáticas',
  'Habilita agendamento de GPU por hardware',
];

export function PerformanceOptimizerCard({ isExecuting, onExecute }: PerformanceOptimizerCardProps) {
  return (
    <Card className="card-hover animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-md transition-transform duration-300 hover:scale-110">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Desempenho</CardTitle>
            <CardDescription>Plano de energia e recursos gráficos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {tweaks.map((item, index) => (
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
        <Button onClick={onExecute} disabled={isExecuting} className="w-full button-hover" size="lg">
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aplicando...
            </>
          ) : (
            'Aplicar ajustes'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
