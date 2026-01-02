import { Card, CardContent } from '@/components/ui/card';
import { Cpu, MemoryStick, Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemStats {
  cpu: number;
  gpu: number;
  ram: number;
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

function CircularProgress({ value, size = 120, strokeWidth = 8, color = 'hsl(var(--primary))' }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
      </div>
    </div>
  );
}

export function StatusPanel() {
  const [stats, setStats] = useState<SystemStats>({ cpu: 0, gpu: 0, ram: 0 });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        cpu: Math.floor(Math.random() * 40 + 10),
        gpu: Math.floor(Math.random() * 50 + 15),
        ram: Math.floor(Math.random() * 60 + 20),
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value < 40) return '#10b981';
    if (value < 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Monitor do Sistema</h2>
        <p className="text-sm text-muted-foreground">Acompanhe o desempenho em tempo real</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center border border-blue-500/20">
                <Cpu className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">CPU</h3>
                <p className="text-xs text-muted-foreground">Processador</p>
              </div>
              <CircularProgress
                value={stats.cpu}
                color={getColor(stats.cpu)}
              />
              <div className="w-full pt-4 border-t border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uso atual</span>
                  <span className="font-medium text-foreground">{stats.cpu}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center border border-orange-500/20">
                <Gauge className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">GPU</h3>
                <p className="text-xs text-muted-foreground">Placa de vídeo</p>
              </div>
              <CircularProgress
                value={stats.gpu}
                color={getColor(stats.gpu)}
              />
              <div className="w-full pt-4 border-t border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uso atual</span>
                  <span className="font-medium text-foreground">{stats.gpu}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-500/20">
                <MemoryStick className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">RAM</h3>
                <p className="text-xs text-muted-foreground">Memória</p>
              </div>
              <CircularProgress
                value={stats.ram}
                color={getColor(stats.ram)}
              />
              <div className="w-full pt-4 border-t border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uso atual</span>
                  <span className="font-medium text-foreground">{stats.ram}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Resumo do Sistema</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">{stats.cpu}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `${stats.cpu}%`,
                    backgroundColor: getColor(stats.cpu)
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GPU</span>
                <span className="font-medium">{stats.gpu}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `${stats.gpu}%`,
                    backgroundColor: getColor(stats.gpu)
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">RAM</span>
                <span className="font-medium">{stats.ram}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `${stats.ram}%`,
                    backgroundColor: getColor(stats.ram)
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
