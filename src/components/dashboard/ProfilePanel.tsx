import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: string;
  username: string;
  avatar?: string;
  discriminator?: string;
  email?: string;
}

interface ProfilePanelProps {
  user: User | null;
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  return (
    <div className="max-w-2xl">
      <Card className="glass-panel glass-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <img
              src={avatarUrl}
              alt="User avatar"
              className="w-20 h-20 rounded-full border-4 border-primary/30 shadow-lg shadow-primary/20"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-glow mb-1 truncate">
                {user?.username}
              </h2>
              {user?.email && (
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              )}
              <p className="text-xs text-muted-foreground/70 mt-1.5">
                ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-4 rounded-lg border border-border/50 glass-panel glass-card">
              <p className="text-xs text-muted-foreground mb-1.5">Tipo de Conta</p>
              <p className="text-sm font-semibold">Administrator</p>
            </div>
            <div className="p-4 rounded-lg border border-border/50 glass-panel glass-card">
              <p className="text-xs text-muted-foreground mb-1.5">Status</p>
              <p className="text-sm font-semibold text-green-500">Ativo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
