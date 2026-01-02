import { Card, CardContent } from '@/components/ui/card';
import { Moon, Bell, Monitor, Activity } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface Settings {
  darkMode: boolean;
  animations: boolean;
  autoStart: boolean;
  notifications: boolean;
}

interface SettingsPanelProps {
  settings: Settings;
  onToggleSetting: (key: keyof Settings) => void;
}

export function SettingsPanel({ settings, onToggleSetting }: SettingsPanelProps) {
  return (
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
                <Toggle checked={settings.darkMode} onChange={() => onToggleSetting('darkMode')} />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Animações</span>
                </div>
                <Toggle checked={settings.animations} onChange={() => onToggleSetting('animations')} />
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
                <Toggle checked={settings.autoStart} onChange={() => onToggleSetting('autoStart')} />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Notificações</span>
                </div>
                <Toggle checked={settings.notifications} onChange={() => onToggleSetting('notifications')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
