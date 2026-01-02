import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Loader2, Check, ArrowRight } from "lucide-react";

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
    <Card className="card-hover animate-scale-in glass-panel glass-card overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md transition-transform duration-300 hover:scale-110 bg-primary/5 border border-primary/20">
              <img className="w-12 h-12" src="/icons/rocket.gif" />
            </div>
            <div>
              <CardTitle className="text-lg">FPS Boost</CardTitle>
              <CardDescription className="text-white/70 font-normal">
                Otimizações de registro para aumentar FPS
              </CardDescription>
            </div>
          </div>
          <div className="glow-pill">
            <span className="glow-dot" />
            <span className="text-[11px] text-muted-foreground">Registro seguro</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-white/70 font-normal"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
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
          className="w-full bg-primary text-primary-foreground group button-shine"
          variant="ghost"
          size="lg"
        >
          {isApplying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aplicando...
            </>
          ) : (
            <>
              Executar Tweak
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
