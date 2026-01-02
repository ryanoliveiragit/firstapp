import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, Wifi } from 'lucide-react';

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
  return (
    <Card className="card-hover animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-md transition-transform duration-300 hover:scale-110">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Rede</CardTitle>
            <CardDescription>Otimizações para latência mais baixa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Button onClick={onExecute} disabled={isExecuting} className="w-full button-hover" size="lg">
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aplicando...
            </>
          ) : (
            'Otimizar rede'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
