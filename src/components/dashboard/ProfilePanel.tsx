import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/contexts/AuthContext';
import { Key, CheckCircle2, Shield, Clock, User as UserIcon, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="max-w-4xl space-y-6">
      {/* Header com informações principais */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                <Key className="w-12 h-12 text-primary" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500/20 border-2 border-green-500/30 rounded-full p-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-glow">
                Usuário Autenticado
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="glow-pill bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Sessão Ativa
                </Badge>
                <Badge className="glow-pill bg-primary/20 text-primary border-primary/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Licença Verificada
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Informações da Conta */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <UserIcon className="w-4 h-4" />
          <span>Informações da Conta</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chave de Licença */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center border border-primary/20">
                <Key className="w-5 h-5 text-primary" strokeWidth={2} />
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
              <div className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center border border-primary/20">
                <Hash className="w-5 h-5 text-primary" strokeWidth={2} />
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
            <div className="w-12 h-12 rounded-xl glass-panel mx-auto flex items-center justify-center border border-primary/20">
              <Shield className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tipo de Conta</p>
              <p className="text-lg font-bold text-foreground">Licença Premium</p>
            </div>
          </div>

          {/* Status */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl glass-panel mx-auto flex items-center justify-center border border-green-500/30 bg-green-500/10">
              <CheckCircle2 className="w-6 h-6 text-green-400" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status da Licença</p>
              <p className="text-lg font-bold text-green-400">Ativa</p>
            </div>
          </div>

          {/* Sessão */}
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl glass-panel mx-auto flex items-center justify-center border border-primary/20">
              <Clock className="w-6 h-6 text-primary" strokeWidth={2} />
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
          <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center flex-shrink-0">
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
