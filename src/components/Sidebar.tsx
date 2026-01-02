import { FileKey, FileCode2, Settings, User, LogOut, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'regedits', label: 'Regedits', icon: FileKey },
  { id: 'exec', label: 'Executáveis', icon: FileCode2 },
  { id: 'config', label: 'Configurações', icon: Settings },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Logo/Header */}
      <div className="p-6 border-b border-border relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center glow-red border border-primary/30">
            <Activity className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-glow tracking-tight">Paragon</h1>
            <p className="text-xs text-muted-foreground">Tweaking Utility</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 relative z-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "font-medium text-sm",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto w-1.5 h-6 bg-background rounded-full opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border relative z-10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}
