import { Card } from "../ui/card";
import { User } from "@/contexts/AuthContext";
import { Key } from "lucide-react";

interface UserBadgeProps {
  user: User | null;
}

export function UserBadge({ user }: UserBadgeProps) {
  // Máscara a chave para exibição
  const maskKey = (key: string) => {
    if (key.length <= 6) return key;
    return `${key.substring(0, 3)}...${key.substring(key.length - 3)}`;
  };

  return (
    <Card className="flex items-center gap-3 w-fit px-3 py-2 rounded-xl glass-panel glass-card">
      <div className="relative">
        <div className="w-9 h-9 rounded-full border-2 border-primary/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] border border-white/40" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium leading-none">Autenticado</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{user ? maskKey(user.licenseKey) : 'N/A'}</p>
      </div>
    </Card>
  );
}
