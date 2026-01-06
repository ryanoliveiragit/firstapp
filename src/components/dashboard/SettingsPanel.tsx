import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Sparkles, Palette, Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme, type AccentColor } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const colorOptions: { value: AccentColor; label: string; preview: string; description: string }[] = [
  { value: "dark", label: "Escuro", preview: "#0a0a0a", description: "Preto profundo" },
  { value: "light", label: "Claro", preview: "#fafafa", description: "Branco puro" },
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
    <div className="space-y-8">
      {/* Header */}

      {/* Seção: Aparência */}
      <div className="space-y-6">
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
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-primary/20">
                    <Palette className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Tema de Cor</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Escolha o esquema de cores do aplicativo
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-primary/20 to-transparent" />

                {/* Grid de Cores - Layout melhorado */}
                <div className="grid grid-cols-2 gap-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "group relative rounded-xl border-2 transition-all duration-200 overflow-hidden",
                        "flex flex-col items-center justify-center p-4 min-h-[100px]",
                        accentColor === color.value
                          ? "border-primary scale-[1.02] shadow-lg shadow-primary/20 bg-primary/5"
                          : "border-white/10 hover:border-primary/50 hover:scale-[1.01] hover:bg-white/5"
                      )}
                      title={color.label}
                      aria-label={`Selecionar tema ${color.label}`}
                    >
                      {/* Preview Color Circle */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full mb-3 transition-all duration-200 border-2",
                          accentColor === color.value
                            ? "border-primary/50 shadow-lg shadow-primary/20 scale-110"
                            : "border-white/20 group-hover:border-primary/30"
                        )}
                        style={{ backgroundColor: color.preview }}
                      />
                      
                      {/* Label */}
                      <span className="text-sm font-medium text-foreground mb-1">
                        {color.label}
                      </span>
                      
                      {/* Description */}
                      <span className="text-xs text-muted-foreground">
                        {color.description}
                      </span>
                      
                      {/* Checkmark indicator */}
                      {accentColor === color.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
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
