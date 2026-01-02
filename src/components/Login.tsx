import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Activity, Home, Settings, HardDrive, Cpu, Gauge } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Left Side - Dashboard Preview */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

        {/* Animated particles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-primary/60 rounded-full animate-ping" />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-primary/80 rounded-full animate-pulse delay-150" />
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-foreground rounded-full animate-ping delay-300" />
        </div>

        {/* Dashboard Preview */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="w-full max-w-md transform perspective-1000" style={{ transform: 'perspective(1000px) rotateY(-12deg)' }}>

            {/* Sidebar Preview */}
            <div className="bg-card/90 backdrop-blur-xl rounded-l-2xl border-l border-t border-b border-border shadow-2xl p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center ring-1 ring-primary/20">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-lg">Paragon</h2>
                  <p className="text-xs text-muted-foreground">Tweaking Utility</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-primary rounded-lg shadow-lg shadow-primary/20">
                  <Home className="w-5 h-5 text-primary-foreground" />
                  <span className="text-primary-foreground font-medium text-sm">Home</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all duration-200">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium text-sm">System Restore</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary rounded-lg transition-all duration-200">
                  <HardDrive className="w-5 h-5" />
                  <span className="font-medium text-sm">Resources</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-border" />

              {/* Tweaks Section */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase px-4 mb-3 font-semibold tracking-wider">Tweaks</p>
                <div className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs">General</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Debloating</span>
                </div>
              </div>
            </div>

            {/* Main Content Preview */}
            <div className="absolute top-12 -right-32 w-80 space-y-4">
              {/* Welcome Card */}
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold">Home</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-glow">Welcome to Paragon</h3>
                <p className="text-sm text-muted-foreground">Performance, Optimization, and Control</p>
              </div>

              {/* CPU Usage Card */}
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center ring-1 ring-primary/20">
                      <Gauge className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">CPU Usage</p>
                      <p className="text-2xl font-bold text-foreground mt-1">13%</p>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[13%] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg shadow-primary/50 transition-all duration-500" />
                </div>
              </div>

              {/* Temperature Monitor */}
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-4 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">Temperature Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 w-full max-w-md px-8">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full backdrop-blur-sm">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Welcome to</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-foreground text-center mb-12 text-glow animate-fade-in-up">
            Paragon
            <span className="block text-2xl font-normal text-muted-foreground mt-2">Tweaking Utility</span>
          </h1>

          {/* Login Card */}
          <Card className="bg-card/80 backdrop-blur-xl border-border shadow-2xl overflow-hidden animate-fade-in-up hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="space-y-1 pb-6 border-b border-border">
              <CardTitle className="text-center flex items-center justify-center gap-3 text-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center ring-1 ring-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl">Log in</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="mb-8">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Faça login com sua conta Discord para acessar o painel de controle
                </p>
              </div>

              <Button
                onClick={login}
                className="w-full h-14 text-base font-semibold bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/20 hover:shadow-[#5865F2]/30 transition-all duration-200 group"
                size="lg"
              >
                <svg
                  className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Log in with Discord
              </Button>

              {/* Additional info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Ao fazer login, você concorda com nossos{' '}
                  <button className="text-primary hover:underline font-medium">Termos de Uso</button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Version Footer */}
          <div className="flex justify-center mt-8">
            <div className="px-4 py-1.5 bg-card/50 backdrop-blur-sm border border-border rounded-full">
              <p className="text-xs text-muted-foreground font-medium">Version 1.4.6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;