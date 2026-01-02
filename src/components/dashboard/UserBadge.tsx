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
    <Card className="flex items-center gap-3 w-fit px-3 border border-white/25 rounded-lg py-2 backdrop-blur-sm  border-border/50">
      <img
        src={avatarUrl}
        alt="User avatar"
        className="w-8 h-8 rounded-full border-2 border-primary/50"
      />
      <div className="hidden sm:block">
        <p className="text-xs font-medium leading-none">{user?.username}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
      </div>
    </Card>
  );
}
