import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, Zap, Clock } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Badge } from "@/components/ui/badge";

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
  const [isEnabled, setIsEnabled] = useLocalStorage("fps-boost-enabled", false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (checked) {
      onApply();
    }
  };

  return (
    <Card className="card-hover animate-scale-in h-full flex flex-col glass-panel glass-card border border-white/10 overflow-hidden">
      {/* Header com gradiente */}
      <CardHeader className="relative border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/10">
              <Zap className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Otimização Avançada</CardTitle>
              <CardDescription className="text-xs">Tweaks de registro para aumentar FPS</CardDescription>
            </div>
          </div>

          {/* Badge de Status */}
          {isEnabled ? (
            <Badge className="glow-pill bg-green-500/20 text-green-400 border-green-500/30">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Ativo
            </Badge>
          ) : (
            <Badge variant="secondary" className="glow-pill">
              <span className="w-2 h-2 rounded-full bg-muted mr-1.5" />
              Inativo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 flex-1 flex flex-col p-6">
        {/* Lista de Features */}
        <ul className="space-y-2.5">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-400" strokeWidth={2} />
              </div>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Separador */}
        <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        {/* Info de Tempo */}
        <div className="flex items-center justify-between text-xs glass-card rounded-lg px-4 py-3 border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Scripts verificados e assinados</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground/80">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">~15s</span>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="flex items-center justify-between p-4 glass-card border border-primary/20 rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            {isApplying && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            <div>
              <p className="text-sm font-semibold">
                {isApplying ? 'Aplicando Tweaks...' : isEnabled ? 'Otimização Aplicada' : 'Executar Otimização'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isApplying ? 'Aguarde...' : isEnabled ? 'Registro modificado' : 'Clique para ativar'}
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isApplying}
          />
        </div>
      </CardContent>
    </Card>
  );
}
