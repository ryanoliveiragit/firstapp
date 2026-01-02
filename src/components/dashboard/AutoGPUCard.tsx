import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gpu, Loader2, Check } from 'lucide-react';

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
    <Card className="card-hover animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-md transition-transform duration-300 hover:scale-110">
            <Gpu className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">GPU Config</CardTitle>
            <CardDescription>Configuração automática para Nvidia e AMD</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={onExecute}
          disabled={isExecuting}
          className="w-full button-hover"
          size="lg"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            'Executar Configuração'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
