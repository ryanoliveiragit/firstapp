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
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center overflow-hidden">
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
