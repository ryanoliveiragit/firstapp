import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const [discordLoading, setDiscordLoading] = useState(false);

  const handleDiscordLogin = async () => {
    setDiscordLoading(true);
    toast.info('Redirecionando para Discord...', {
      description: 'Você será redirecionado para fazer login'
    });
    try {
      await login();
    } catch (error) {
      toast.error('Erro ao fazer login', {
        description: 'Ocorreu um erro ao tentar fazer login com Discord'
      });
      setDiscordLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />

      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 mb-4">
              <Zap className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Synapse
              </h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Plataforma inteligente para otimização de performance e tweaking avançado
              </p>
            </div>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Faça login com sua conta Discord para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleDiscordLogin}
                disabled={discordLoading}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/20"
                size="lg"
              >
                {discordLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span>Continuar com Discord</span>
                  </span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Início de sessão seguro</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Ao continuar, você concorda com nossos{" "}
                <button className="text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors">
                  Termos de Serviço
                </button>
                {" "}e{" "}
                <button className="text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors">
                  Política de Privacidade
                </button>
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Todos os sistemas operacionais</span>
            </div>
            <span>•</span>
            <span>v1.5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
