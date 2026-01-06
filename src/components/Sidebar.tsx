import { useState, useEffect } from 'react';
import { FileKey, FileCode2, Settings, User, LogOut, Activity, Loader2 } from 'lucide-react';
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

const typingTexts = [
  'Otimizando performance...',
  'Analisando sistema...',
  'Melhorando velocidade...',
  'Limpando recursos...',
  'Acelerando processos...',
];

export default function Sidebar({ activeTab, setActiveTab, isOptimizationsLoading }: SidebarProps) {
  const { logout } = useAuth();

  const [typingText, setTypingText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = typingTexts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typingText.length < currentFullText.length) {
            setTypingText(currentFullText.slice(0, typingText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (typingText.length > 0) {
            setTypingText(typingText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          }
        }
      },
      isDeleting ? 50 : 80
    );

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, currentTextIndex]);

  return (
    <div className="relative w-64 h-screen bg-background backdrop-blur-xl border-r border-white/5 flex flex-col">
      {/* Header minimalista */}
      <div className="p-6 border-b border-white/5">
        <div className="flex flex-col items-center gap-4">
       

          {/* Nome */}
          <div className="text-center">
            <h1 className="text-xl font-light tracking-widest text-[#b7ff58] mb-2">
              SYNAPSE
            </h1>
            
            {/* Texto digitando */}
            <div className="h-2 flex items-center justify-center">
              <p className="text-xs text-white/50 font-mono">
                {typingText}
                <span className="inline-block w-0.5 h-3 bg-white/50 ml-0.5 animate-blink" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation minimalista */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
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
                'group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5',
                isLoadingOptimizations && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Indicador ativo */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#b7ff58] rounded-r-full" />
              )}
              
              {/* Icon */}
              {isLoadingOptimizations ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <Icon 
                  className="w-4 h-4 transition-transform group-hover:scale-110" 
                  strokeWidth={1.5} 
                />
              )}
              
              {/* Label */}
              <span className="text-sm font-light">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer minimalista */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-300"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
          <span className="text-sm font-light">Sair</span>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes draw-stroke {
          0%, 100% {
            stroke-dasharray: 150;
            stroke-dashoffset: 150;
          }
          50% {
            stroke-dasharray: 150;
            stroke-dashoffset: 0;
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-draw-stroke {
          animation: draw-stroke 4s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}