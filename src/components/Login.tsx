import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Activity, Home, Settings, HardDrive, Cpu, Gauge } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex min-h-screen overflow-hidden bg-black">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Left Side - Dashboard Preview with Red Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Intense red gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Animated particles/dots */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-red-300 rounded-full animate-ping" />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
        </div>

        {/* Dashboard Preview in 3D Perspective */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="w-full max-w-md transform perspective-1000 -rotate-y-12" style={{ transform: 'perspective(1000px) rotateY(-15deg)' }}>

            {/* Sidebar Preview */}
            <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-l-2xl border-l border-t border-b border-red-900/30 p-6 shadow-2xl">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-red-900/30">
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center glow-red">
                  <Activity className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">Paragon</h2>
                  <p className="text-xs text-red-400">Tweaking Utility</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-red-600/90 rounded-lg glow-red">
                  <Home className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">Home</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium text-sm">System Restore</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-gray-500">
                  <HardDrive className="w-5 h-5" />
                  <span className="font-medium text-sm">Resources</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-red-900/20" />

              {/* Tweaks Section */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase px-4 mb-3">Tweaks</p>
                <div className="flex items-center gap-3 px-4 py-2 text-gray-500">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs">General</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Debloating</span>
                </div>
              </div>
            </div>

            {/* Main Content Preview - Positioned to the right */}
            <div className="absolute top-12 -right-32 w-80 space-y-4">
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-2xl border border-red-900/20 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Home className="w-5 h-5 text-red-500" />
                  <span className="text-white font-semibold">Home</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-glow">Welcome to Paragon</h3>
                <p className="text-sm text-gray-400">Performance, Optimization, and</p>
              </div>

              {/* CPU Usage Card */}
              <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-2xl border border-red-900/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">CPU Usage</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white text-glow">13%</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-[13%] bg-gradient-to-r from-red-600 to-red-500 rounded-full glow-red" />
                </div>
              </div>

              {/* Temperature Monitor */}
              <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-2xl border border-red-900/20 p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Temperature Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 w-full max-w-md px-8">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 bg-red-950/30 border border-red-900/50 rounded-full">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Welcome to:</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-white text-center mb-12 text-glow">
            Paragon Tweaking Utility
          </h1>

          {/* Login Card */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border-gray-800/50 shadow-2xl overflow-hidden">
            <CardHeader className="space-y-1 pb-4 border-b border-gray-800/50">
              <CardTitle className="text-center flex items-center justify-center gap-2 text-gray-200">
                <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                Log in
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-sm text-gray-400 text-center">
                  Faça login com sua conta Discord para acessar o painel de controle
                </p>
              </div>

              <Button
                onClick={login}
                className="w-full h-14 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                size="lg"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Log in with Discord
              </Button>
            </CardContent>
          </Card>

          {/* Version Footer */}
          <div className="absolute bottom-8 right-8">
            <p className="text-xs text-gray-600">v1.4.6</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
