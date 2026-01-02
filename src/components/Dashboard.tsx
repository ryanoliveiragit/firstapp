import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge, Gpu, Play, AlertCircle, CheckCircle2, Moon, Bell, Monitor, Activity } from 'lucide-react';
import { Command } from '@tauri-apps/plugin-shell';
import { resolveResource } from '@tauri-apps/api/path';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('regedits');
  const [isExecuting, setIsExecuting] = useState(false);
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    darkMode: true,
    animations: true,
    autoStart: false,
    notifications: true,
  });

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${user?.discriminator ? parseInt(user.discriminator) % 5 : 0}.png`;

  const handleFPSBoost = () => {
    console.log('Executing FPS Boost registry tweak...');
  };

  const handleAutoGPU = async () => {
    setIsExecuting(true);
    try {
      const batchPath = await resolveResource('auto-gpu-config.bat');
      const quotedPath = `"${batchPath}"`;
      const output = await Command.create('cmd', ['/C', 'start', '""', quotedPath]).execute();

      if (output.code === 0) {
        alert('✓ GPU configurada com sucesso!');
      } else {
        alert(`✗ Erro ao configurar GPU: ${output.stderr || 'Código de saída diferente de zero.'}`);
      }
    } catch (error) {
      alert(`✗ Erro: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Custom Toggle Switch Component
  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-primary' : 'bg-secondary'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="flex h-screen bg-background grid-background overflow-hidden">
      <div className="scan-line" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-6 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-glow tracking-tight">
                {activeTab === 'regedits' && 'Registry Tweaks'}
                {activeTab === 'exec' && 'Executáveis'}
                {activeTab === 'config' && 'Configurações'}
                {activeTab === 'profile' && 'Perfil'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'regedits' && 'Otimizações de registro do sistema'}
                {activeTab === 'exec' && 'Utilitários e ferramentas de sistema'}
                {activeTab === 'config' && 'Personalize suas preferências'}
                {activeTab === 'profile' && 'Informações da sua conta'}
              </p>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-3 px-3 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-8 h-8 rounded-full border-2 border-primary/50"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-none">{user?.username}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'regedits' && (
            <div className="space-y-4">
              {/* Warning Banner */}
              <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-500">Crie um ponto de restauração</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Modificações no registro podem afetar o sistema. Recomendamos criar um backup antes.
                  </p>
                </div>
              </div>

              {/* FPS Boost Card */}
              <Card className="group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                        <Gauge className="w-6 h-6 text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">FPS Boost</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Otimizações de registro para aumentar FPS em jogos
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 py-2">
                      {[
                        'Desativa recursos visuais desnecessários',
                        'Otimiza prioridade de processos de jogo',
                        'Reduz latência de entrada (Input Lag)',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleFPSBoost}
                      className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4" strokeWidth={2.5} />
                      Executar Tweak
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'exec' && (
            <div className="max-w-2xl">
              {/* Auto GPU Card - Único executável */}
              <Card className="group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                        <Gpu className="w-6 h-6 text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">Auto GPU Config Nvidia/AMD</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Configuração automática de GPU para Nvidia e AMD
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 py-2">
                      {[
                        'Detecta automaticamente fabricante da GPU',
                        'Aplica configurações otimizadas de energia',
                        'Configura perfil de alto desempenho',
                        'Ajusta prioridades de renderização',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAutoGPU}
                      disabled={isExecuting}
                      className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExecuting ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                          Executando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" strokeWidth={2.5} />
                          Executar Configuração
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-2xl">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground/90">Aparência</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Moon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Tema Escuro</span>
                        </div>
                        <Toggle checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Animações</span>
                        </div>
                        <Toggle checked={settings.animations} onChange={() => toggleSetting('animations')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground/90">Sistema</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Iniciar com Windows</span>
                        </div>
                        <Toggle checked={settings.autoStart} onChange={() => toggleSetting('autoStart')} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Notificações</span>
                        </div>
                        <Toggle checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <Card>
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
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1.5">Tipo de Conta</p>
                      <p className="text-sm font-semibold">Administrator</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1.5">Status</p>
                      <p className="text-sm font-semibold text-green-500">Ativo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
