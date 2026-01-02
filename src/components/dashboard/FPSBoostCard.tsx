import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, Loader2, Check } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-md">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">FPS Boost</CardTitle>
            <CardDescription>Otimizações de registro para aumentar FPS</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={onApply}
          disabled={isApplying}
          className="w-full"
          size="lg"
        >
          {isApplying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aplicando...
            </>
          ) : (
            'Executar Tweak'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
