import { CheckCircle2 } from "lucide-react";
export function DashboardHeader() {

  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 bg-gradient-to-r from-transparent to-white/5">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-green-500/10 rounded-md transition-transform duration-300 hover:scale-110 border border-green-500/30 flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Conta Verificada</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sua licença foi validada com sucesso e você tem acesso completo a todas as funcionalidades do sistema.
          Mantenha sua chave em segurança e não a compartilhe com terceiros.
        </p>
      </div>
    </div>
  </div>
  );
}
