import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Sparkles, Palette, Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme, type AccentColor } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const colorOptions: { value: AccentColor; label: string; preview: string }[] = [
  { value: "orange", label: "Laranja", preview: "#130501" },
  { value: "red", label: "Vermelho", preview: "#ff6b6b" },
  { value: "blue", label: "Azul", preview: "#4ecdc4" },
  { value: "green", label: "Verde", preview: "#95e1d3" },
  { value: "purple", label: "Roxo", preview: "#aa96da" },
];

export function SettingsPanel() {
  const {
    theme,
    accentColor,
    animations,
    toggleTheme,
    setAccentColor,
    setAnimations,
  } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <Settings className="w-8 h-8 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-glow">Configurações</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Personalize sua experiência no aplicativo
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Aparência */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Palette className="w-4 h-4" />
          <span>Aparência e Tema</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <Card className="glass-panel glass-card border border-white/10">
          <CardContent className="p-6 space-y-6">
            {/* Modo Escuro/Claro */}
            <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-primary/20">
                    {theme === "dark" ? (
                      <Moon className="w-6 h-6 text-primary transition-transform hover:rotate-12" strokeWidth={2} />
                    ) : (
                      <Sun className="w-6 h-6 text-primary transition-transform hover:rotate-90" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Modo de Tema</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado"}
                    </p>
                  </div>
                </div>
                <Toggle checked={theme === "dark"} onChange={toggleTheme} />
              </div>
            </div>

            {/* Cor de Destaque */}
            <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-primary/30 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-primary/20">
                    <Palette className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Cor de Destaque</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Escolha a cor principal do aplicativo
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-primary/20 to-transparent" />

                {/* Grid de Cores */}
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "group relative h-14 rounded-xl border-2 transition-all overflow-hidden",
                        accentColor === color.value
                          ? "border-primary scale-105 shadow-lg shadow-primary/20"
                          : "border-white/10 hover:border-primary/50 hover:scale-105"
                      )}
                      title={color.label}
                      aria-label={`Selecionar cor ${color.label}`}
                    >
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color.preview }}
                      />
                      {accentColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-3 h-3 bg-white rounded-full shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animações */}
            <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-primary/20">
                    <Sparkles className="w-6 h-6 text-primary transition-transform hover:scale-110" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Animações</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Transições e efeitos visuais suaves
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={animations}
                  onChange={() => setAnimations(!animations)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <div className="glass-card rounded-xl p-5 border border-white/5 bg-gradient-to-r from-transparent to-white/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center flex-shrink-0">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Preferências Salvas</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Todas as configurações são salvas automaticamente e aplicadas imediatamente.
              Suas preferências são mantidas entre sessões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
