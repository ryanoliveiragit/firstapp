import { Card } from "../ui/card";

interface User {
  id: string;
  username: string;
  avatar?: string;
  discriminator?: string;
  email?: string;
}

interface UserBadgeProps {
  user: User | null;
}

export function UserBadge({ user }: UserBadgeProps) {
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  return (
    <Card className="flex items-center gap-3 w-fit px-3 py-2 rounded-xl glass-panel glass-card">
      <div className="relative">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-9 h-9 rounded-full border-2 border-primary/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]"
        />
        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] border border-white/40" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium leading-none">{user?.username}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Admin</p>
      </div>
    </Card>
  );
}
