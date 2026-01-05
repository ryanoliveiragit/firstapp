import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/contexts/AuthContext';
import { Key, CheckCircle2 } from 'lucide-react';

interface ProfilePanelProps {
  user: User | null;
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  if (!user) {
    return (
      <div className="max-w-2xl">
        <Card className="glass-panel glass-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Nenhum usuário logado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Máscara a chave para exibição (mostra apenas primeiros e últimos caracteres)
  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="max-w-2xl">
      <Card className="glass-panel glass-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div className="w-20 h-20 rounded-full border-4 border-primary/30 shadow-lg shadow-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
              <Key className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-glow mb-1 truncate">
                Usuário Autenticado
              </h2>
              <p className="text-sm text-muted-foreground truncate mt-1">
                Chave: {maskKey(user.licenseKey)}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1.5">
                ID: {user.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-4 rounded-lg border border-border/50 glass-panel glass-card">
              <p className="text-xs text-muted-foreground mb-1.5">Tipo de Conta</p>
              <p className="text-sm font-semibold">Licença</p>
            </div>
            <div className="p-4 rounded-lg border border-border/50 glass-panel glass-card">
              <p className="text-xs text-muted-foreground mb-1.5">Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-sm font-semibold text-green-500">Ativo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
