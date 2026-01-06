import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/contexts/AuthContext';
import { Key, CheckCircle2, Shield, Clock, User as UserIcon, Hash } from 'lucide-react';

interface ProfilePanelProps {
  user: User | null;
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  if (!user) {
    return (
      <div className="max-w-4xl">
        <Card className="glass-panel glass-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Nenhum usuário logado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Máscara a chave para exibição
  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <UserIcon className="w-4 h-4" />
          <span>Informações da Conta</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chave de Licença */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Chave de Licença</p>
                <code className="text-sm font-mono text-foreground truncate block">
                  {maskKey(user.licenseKey)}
                </code>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-primary/20 to-transparent" />
            <p className="text-xs text-muted-foreground">
              Esta é sua chave de acesso ao sistema
            </p>
          </div>

          {/* ID do Usuário */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20">
                <Hash className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">ID do Usuário</p>
                <code className="text-sm font-mono text-foreground truncate block">
                  {user.id}
                </code>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-primary/20 to-transparent" />
            <p className="text-xs text-muted-foreground">
              Identificador único da conta
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Status da Conta */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Shield className="w-4 h-4" />
          <span>Status e Permissões</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo de Conta */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 text-center">
            <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20 mx-auto w-fit">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tipo de Conta</p>
              <p className="text-lg font-bold text-foreground">Licença Premium</p>
            </div>
          </div>

          {/* Status */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 text-center">
            <div className="p-2 bg-green-500/10 rounded-md transition-transform duration-300 hover:scale-110 border border-green-500/30 mx-auto w-fit">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status da Licença</p>
              <p className="text-lg font-bold text-green-400">Ativa</p>
            </div>
          </div>

          {/* Sessão */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 text-center">
            <div className="p-2 bg-primary/10 rounded-md transition-transform duration-300 hover:scale-110 border border-primary/20 mx-auto w-fit">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sessão</p>
              <p className="text-lg font-bold text-foreground">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
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
    </div>
  );
}
