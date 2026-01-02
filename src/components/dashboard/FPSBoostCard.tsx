import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Zap } from "lucide-react";

interface FPSBoostCardProps {
  isApplying: boolean;
  onApply: () => void;
}

const features = [
  "Desativa recursos visuais desnecessários",
  "Otimiza prioridade de processos de jogo",
  "Reduz latência de entrada (Input Lag)",
];

export function FPSBoostCard({ isApplying, onApply }: FPSBoostCardProps) {
  return (
    <Card className="card-hover animate-scale-in h-full flex flex-col glass-panel glass-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-md transition-transform duration-300 hover:scale-110 border border-white/10">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Otimização avançada</CardTitle>
              <CardDescription>Otimizações de registro para aumentar FPS</CardDescription>
            </div>
          </div>
  
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground border border-white/5 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="glow-dot" />
            Scripts verificados e assinados
          </span>
          <span className="text-foreground/80">~15s</span>
        </div>
        <Button
          onClick={onApply}
          disabled={isApplying}
          className="w-full button-hover button-shine bg-primary/90 text-primary-foreground"
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
