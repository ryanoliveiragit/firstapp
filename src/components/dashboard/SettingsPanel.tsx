import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/contexts/ThemeContext';

export function SettingsPanel() {
  const { theme, animations, notifications, toggleTheme, setAnimations, setNotifications } = useTheme();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Preferências</h2>
        <p className="text-sm text-muted-foreground">Gerencie as configurações do aplicativo</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Aparência</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {theme === 'dark' ? 'Modo escuro' : 'Modo claro'}
                    </p>
                  </div>
                </div>
                <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Animações</p>
                    <p className="text-xs text-muted-foreground">
                      Transições e efeitos visuais
                    </p>
                  </div>
                </div>
                <Toggle checked={animations} onChange={() => setAnimations(!animations)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
