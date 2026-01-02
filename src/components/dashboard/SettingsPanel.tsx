import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Sparkles, Palette } from "lucide-react";
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
    <div className="max-w-2xl space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-lg font-semibold mb-1">Preferências</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações do aplicativo
        </p>
      </div>

      <Card
        className="card-hover animate-scale-in"
        style={{ animationDelay: "100ms" }}
      >
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Aparência</h3>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-muted-foreground transition-transform hover:rotate-12" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground transition-transform hover:rotate-90" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {theme === "dark" ? "Modo escuro" : "Modo claro"}
                    </p>
                  </div>
                </div>
                <Toggle checked={theme === "dark"} onChange={toggleTheme} />
              </div>

              <div
                className="p-3 rounded-md border bg-card space-y-3 hover:bg-accent/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cor de destaque</p>
                    <p className="text-xs text-muted-foreground">
                      Personalize a cor principal do aplicativo
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "group relative h-10 rounded-md border-2 transition-all overflow-hidden",
                        accentColor === color.value
                          ? "border-foreground scale-105 shadow-lg"
                          : "border-border hover:border-foreground/50 hover:scale-105"
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
                          <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: "250ms" }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground transition-transform hover:scale-110" />
                  <div>
                    <p className="text-sm font-medium">Animações</p>
                    <p className="text-xs text-muted-foreground">
                      Transições e efeitos visuais
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={animations}
                  onChange={() => setAnimations(!animations)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
