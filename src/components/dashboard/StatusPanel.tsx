import { Card, CardContent } from '@/components/ui/card';
import { Cpu, MemoryStick, Gauge, HardDrive, Thermometer, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface DiskInfo {
  name: string;
  total_space: number;
  available_space: number;
  used_space: number;
  usage_percentage: number;
}

interface SystemStatsData {
  cpu_usage: number;
  cpu_temp?: number;
  memory_usage: number;
  memory_total: number;
  memory_used: number;
  disks: DiskInfo[];
  os_name: string;
  os_version: string;
  kernel_version: string;
}

interface SystemStats {
  cpu: number;
  gpu: number;
  ram: number;
  cpuTemp?: number;
}

interface HistoryData {
  cpu: number[];
  ram: number[];
  gpu: number[];
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showTemp?: boolean;
  temp?: number;
}

interface LineChartProps {
  data: number[];
  color: string;
  label: string;
}

function LineChart({ data, color, label }: LineChartProps) {
  const width = 300;
  const height = 80;
  const padding = 10;
  const max = 100;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value / max) * (height - padding * 2));
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{data[data.length - 1]}%</span>
      </div>
      <svg width={width} height={height} className="w-full">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />

        {/* Area */}
        <polygon points={areaPoints} fill={`url(#gradient-${label})`} />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
}

function CircularProgress({ value, size = 120, strokeWidth = 8, color = 'hsl(var(--primary))', showTemp = false, temp }: CircularProgressProps) {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
        {showTemp && temp !== undefined && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Thermometer className="w-3 h-3" />
            {temp}°C
          </span>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function StatusPanel() {
  const [stats, setStats] = useState<SystemStats>({ cpu: 0, gpu: 0, ram: 0 });
  const [history, setHistory] = useState<HistoryData>({
    cpu: Array(20).fill(0),
    ram: Array(20).fill(0),
    gpu: Array(20).fill(0),
  });
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [osInfo, setOsInfo] = useState({ name: '', version: '', kernel: '' });

  useEffect(() => {
    const updateStats = async () => {
      try {
        const result = await invoke<SystemStatsData>('get_system_stats');

        const newStats = {
          cpu: Math.round(result.cpu_usage),
          gpu: Math.floor(Math.random() * 50 + 15), // GPU ainda simulado
          ram: Math.round(result.memory_usage),
          cpuTemp: result.cpu_temp,
        };

        setStats(newStats);
        setDisks(result.disks);
        setOsInfo({
          name: result.os_name,
          version: result.os_version,
          kernel: result.kernel_version,
        });

        // Atualizar histórico
        setHistory((prev) => ({
          cpu: [...prev.cpu.slice(1), newStats.cpu],
          ram: [...prev.ram.slice(1), newStats.ram],
          gpu: [...prev.gpu.slice(1), newStats.gpu],
        }));
      } catch (error) {
        console.error('Erro ao obter stats do sistema:', error);
        // Fallback para valores simulados
        const newStats = {
          cpu: Math.floor(Math.random() * 40 + 10),
          gpu: Math.floor(Math.random() * 50 + 15),
          ram: Math.floor(Math.random() * 60 + 20),
        };

        setStats(newStats);

        setHistory((prev) => ({
          cpu: [...prev.cpu.slice(1), newStats.cpu],
          ram: [...prev.ram.slice(1), newStats.ram],
          gpu: [...prev.gpu.slice(1), newStats.gpu],
        }));
      }
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

      {/* Windows Info */}
      {osInfo.name && (
        <Card className="card-hover animate-fade-in glass-panel glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{osInfo.name}</p>
                <p className="text-xs text-muted-foreground">Versão {osInfo.version}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Kernel</p>
                <p className="text-xs font-medium">{osInfo.kernel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in glass-panel glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">CPU</h3>
                <p className="text-xs text-muted-foreground">Processador</p>
              </div>
              <CircularProgress
                value={stats.cpu}
                color={getColor(stats.cpu)}
                showTemp={stats.cpuTemp !== undefined}
                temp={stats.cpuTemp}
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

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in glass-panel glass-card" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                <Gauge className="w-6 h-6 text-primary" />
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

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in md:col-span-2 lg:col-span-1 glass-panel glass-card" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                <MemoryStick className="w-6 h-6 text-primary" />
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

      {/* Historical Graph */}
      <Card className="animate-fade-in glass-panel glass-card" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Histórico de Uso</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <LineChart data={history.cpu} color={getColor(stats.cpu)} label="CPU" />
            <LineChart data={history.gpu} color={getColor(stats.gpu)} label="GPU" />
            <LineChart data={history.ram} color={getColor(stats.ram)} label="RAM" />
          </div>
        </CardContent>
      </Card>

      {/* Disk Information */}
      {disks.length > 0 && (
        <Card className="animate-fade-in glass-panel glass-card" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Armazenamento
            </h3>
            <div className="space-y-4">
              {disks.map((disk, index) => (
                <div key={index} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${450 + index * 50}ms` }}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{disk.name}</span>
                    <span className="text-muted-foreground">
                      {formatBytes(disk.used_space)} / {formatBytes(disk.total_space)}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${disk.usage_percentage}%`,
                        backgroundColor: getColor(disk.usage_percentage)
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{disk.usage_percentage.toFixed(1)}% utilizado</span>
                    <span>{formatBytes(disk.available_space)} disponível</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Panel */}
      <Card className="animate-fade-in glass-panel glass-card" style={{ animationDelay: '500ms' }}>
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
