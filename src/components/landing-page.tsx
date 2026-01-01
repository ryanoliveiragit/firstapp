import { AudioWave } from "./audio-wave"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Zap, ChevronRight } from "lucide-react"

interface LandingPageProps {
  onShowLogin: () => void
}

export function LandingPage({ onShowLogin }: LandingPageProps) {

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-950/20" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />

      <header className="relative z-20 border-b border-border/40 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">OptimizerAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#funcionalidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#planos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos e preços
            </a>
          </div>

          <Button
            variant="outline"
            onClick={onShowLogin}
            className="border-primary/50 hover:bg-primary/10"
          >
            Fazer Login
          </Button>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8 py-20">
          <div className="animate-fade-in space-y-6">
            <AudioWave />

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Otimize seus processos
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                com inteligência artificial
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maximize sua produtividade com algoritmos avançados de IA.
              Transforme dados em decisões inteligentes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold group"
              onClick={onShowLogin}
            >
              Ver planos
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold border-primary/50 hover:bg-primary/10"
              onClick={onShowLogin}
            >
              Acessar agora
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fade-in">
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ultra Rápido
              </h3>
              <p className="text-sm text-muted-foreground">
                Processamento em tempo real com algoritmos otimizados
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Resultados Reais
              </h3>
              <p className="text-sm text-muted-foreground">
                Aumento de até 300% na eficiência operacional
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                IA Avançada
              </h3>
              <p className="text-sm text-muted-foreground">
                Machine Learning de última geração
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 OptimizerAI. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
