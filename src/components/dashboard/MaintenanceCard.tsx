import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, Sparkles } from 'lucide-react';

interface MaintenanceCardProps {
  isExecuting: boolean;
  onExecute: () => void;
}

const maintenanceTasks = [
  'Limpa pastas temporárias e cache do sistema',
  'Esvazia lixeira e remove arquivos obsoletos',
  'Atualiza cache DNS e remove registros ARP',
];

export function MaintenanceCard({ isExecuting, onExecute }: MaintenanceCardProps) {
  return (
    <Card className="card-hover animate-scale-in h-full flex flex-col glass-panel glass-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-md transition-transform duration-300 hover:scale-110 border border-white/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Limpeza Rápida</CardTitle>
              <CardDescription>Remove arquivos temporários e cache</CardDescription>
            </div>
          </div>
          <div className="glow-pill">
            <span className="glow-dot" />
            <span className="text-[11px] text-muted-foreground">Higienização</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <ul className="space-y-2">
          {maintenanceTasks.map((task, index) => (
            <li
              key={task}
              className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground border border-white/5 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="glow-dot" />
            Libera espaço e cache
          </span>
          <span className="text-foreground/80">~30s</span>
        </div>
        <Button onClick={onExecute} disabled={isExecuting} className="w-full button-hover button-shine bg-primary/90 text-primary-foreground" size="lg">
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            'Rodar limpeza'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
