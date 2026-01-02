import { useState } from 'react';
import { FileKey, FileCode2, Settings, User, LogOut, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'regedits', label: 'Registry', icon: FileKey },
  { id: 'exec', label: 'Executáveis', icon: FileCode2 },
  { id: 'status', label: 'Status', icon: Activity },
  { id: 'config', label: 'Configurações', icon: Settings },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col animate-slide-in-left">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 bg-foreground dark:bg-transparent rounded-md flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Synapse Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Zap className="w-5 h-5 text-background" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Synapse</h1>
            <p className="text-xs text-muted-foreground">Performance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium animate-fade-in-up hover:scale-[1.02]",
                isActive
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border animate-fade-in" style={{ animationDelay: '300ms' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 hover:scale-[1.02]"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
