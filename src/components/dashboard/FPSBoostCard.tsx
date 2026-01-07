import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, Zap } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
    <Card className="card-hover animate-scale-in h-full flex flex-col glass-panel glass-card border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-6 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Otimização Avançada</CardTitle>
              <CardDescription>Tweaks de registro para aumentar FPS</CardDescription>
            </div>
          </div>
          <div className={`glow-pill ${isEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/10 border-muted/20'}`}>
            {isEnabled ? (
              <>
                <span className="relative inline-flex">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[11px] text-green-500">Ativo</span>
              </>
            ) : (
              <>
                <span className="glow-dot bg-muted" />
                <span className="text-[11px] text-muted-foreground">Ativo</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0 px-6 pb-6">
        <div className="flex-1 flex flex-col space-y-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
 
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg mt-auto">
          <div className="flex items-center gap-2">
            {isApplying && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-medium">
              {isApplying ? 'Aplicando...' : isEnabled ? 'Ativo' : 'Executar Otimização'}
            </span>
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
