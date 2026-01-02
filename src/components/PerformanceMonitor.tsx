import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
  });

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30 + 10),
        memory: Math.floor(Math.random() * 40 + 30),
        disk: Math.floor(Math.random() * 20 + 40),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value < 30) return 'text-green-500';
    if (value < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          System Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">CPU Usage</span>
            <span className={`font-mono font-bold ${getColor(metrics.cpu)}`}>
              {metrics.cpu}%
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-red-500 rounded-full transition-all duration-500 ease-out glow-red"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Memory Usage</span>
            <span className={`font-mono font-bold ${getColor(metrics.memory)}`}>
              {metrics.memory}%
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-red-500 rounded-full transition-all duration-500 ease-out glow-red"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </div>

        {/* Disk Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Disk Usage</span>
            <span className={`font-mono font-bold ${getColor(metrics.disk)}`}>
              {metrics.disk}%
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-red-500 rounded-full transition-all duration-500 ease-out glow-red"
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
