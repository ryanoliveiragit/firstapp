import { useState } from 'react';
import { FileKey, FileCode2, Settings, User, LogOut, Zap, Activity, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void | Promise<void>;
  isOptimizationsLoading?: boolean;
}

const menuItems = [
  { id: 'optimizations', label: 'Otimizações', icon: FileKey },
  { id: 'utilities', label: 'Utilitários', icon: FileCode2 },
  { id: 'status', label: 'Status', icon: Activity },
  { id: 'config', label: 'Configurações', icon: Settings },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function Sidebar({ activeTab, setActiveTab, isOptimizationsLoading }: SidebarProps) {
  const { logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="relative w-64 h-screen border-r border-white/10 glass-panel flex flex-col animate-slide-in-left overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/0 pointer-events-none" />
      <div className="p-5 pb-4 relative z-10">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Synapse Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">synapse</h1>
            <p className="text-xs text-muted-foreground">Performance Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 relative z-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isOptimizationsButton = item.id === 'optimizations';
          const isLoadingOptimizations = isOptimizationsButton && isOptimizationsLoading;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isLoadingOptimizations) return;
                void setActiveTab(item.id);
              }}
              disabled={isLoadingOptimizations}
              className={cn(
                'group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium animate-fade-in-up button-shine',
                isActive
                  ? 'border border-primary/30 bg-white/10 text-foreground shadow-[0_10px_40px_-25px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 hover:border hover:border-white/10',
                isLoadingOptimizations && 'opacity-70 cursor-not-allowed'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              aria-busy={isLoadingOptimizations}
            >
              <span className="w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              {isLoadingOptimizations ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2} />
              )}
              <span className="flex-1 text-left">
                {isLoadingOptimizations ? 'Buscando otimizações...' : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 relative z-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 hover:scale-[1.02]"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
