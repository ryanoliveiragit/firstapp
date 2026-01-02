import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleUserRound } from "lucide-react";
import { Loader2, TrendingUp, Users, Server } from "lucide-react";

type LoginState = "idle" | "loading" | "success" | "error";

const Login = () => {
  const { login } = useAuth();
  const [discordLoading, setDiscordLoading] = useState(false);
  const [state, setState] = useState<LoginState>("idle");
  const [scanLinePosition, setScanLinePosition] = useState(0);

  // Scanning animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePosition((prev) => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleDiscordLogin = async () => {
    setDiscordLoading(true);
    try {
      await login();
    } finally {
      setDiscordLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      label: "10,247",
      subtitle: "Usuários ativos",
      status: "default",
    },
    {
      icon: Server,
      label: "Online",
      subtitle: "Sistema operacional",
      status: "success",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
          }}
        />
      </div>

      {/* Scanning line effect */}
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 transition-all duration-75 pointer-events-none z-50"
        style={{ top: `${scanLinePosition}%` }}
      />

      {/* Glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-12 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-16 items-center">
            {/* Left side - Hero */}
            <div className="space-y-12 animate-fade-in">
              {/* Logo/Brand */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full  bg-green-500/10 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-400">
                    Sistema Avançado de Otimização
                  </span>
                </div>

                <div>
                  <h1 className="text-6xl lg:text-7xl font-bold mb-2 tracking-tight">
                    <span className="text-foreground">Babu menu</span>
                  </h1>
                  <h2 className="text-4xl lg:text-5xl font-bold text-primary tracking-tight text-glow">
                    Tweaking Utility
                  </h2>
                </div>

                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Plataforma inteligente para otimização de sistemas. Tecnologia
                  de ponta para máximo desempenho em jogos e aplicações.
                </p>
              </div>
              <div className="flex items-center gap-6 pt-4 flex-wrap">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stat.status === "success"
                            ? "bg-green-500/10"
                            : "bg-primary/10"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            stat.status === "success"
                              ? "bg-green-500 animate-pulse"
                              : "bg-primary"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {stat.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.subtitle}
                        </div>
                      </div>
                      {idx < stats.length - 1 && (
                        <div className="w-px h-10 bg-border ml-3" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side - Login Card */}
            <div className="w-full max-w-md relative z-10">
              <Card className="border-border bg-card/95 backdrop-blur-xl shadow-2xl">
                {/* Top accent */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <CardHeader className="text-center space-y-2 pt-8 pb-6">
                  <CardTitle className="text-2xl font-light text-foreground tracking-tight">
                    Log in
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Continue com sua conta Discord
                  </p>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <Button
                    onClick={handleDiscordLogin}
                    disabled={discordLoading}
                    className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-all duration-200 group disabled:opacity-50"
                  >
                    {discordLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Conectando</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                        <span>Continue com Discord</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </Button>

                  {/* Additional info */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ao continuar, você concorda com os{" "}
                      <button className="text-primary hover:underline font-medium transition-colors">
                        Termos de Uso
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  © 2026 Paragon Tweaking Utility · v1.4.6
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
