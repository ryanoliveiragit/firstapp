import { useState, useEffect } from 'react';
import OptimizationCard from './OptimizationCard';
import ProgressBar from './ProgressBar';
import SystemStatus from './SystemStatus';

export default function Welcome() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(38);

  const [cardStatuses, setCardStatuses] = useState<{
    registry: 'idle' | 'scanning' | 'optimizing' | 'complete';
    cache: 'idle' | 'scanning' | 'optimizing' | 'complete';
    disk: 'idle' | 'scanning' | 'optimizing' | 'complete';
    startup: 'idle' | 'scanning' | 'optimizing' | 'complete';
  }>({
    registry: 'idle',
    cache: 'idle',
    disk: 'idle',
    startup: 'idle',
  });

  useEffect(() => {
    if (isOptimizing) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 2;
        setProgress(currentProgress);

        // Simular mudanças nos status dos cards
        if (currentProgress < 25) {
          setCardStatuses({
            registry: 'scanning',
            cache: 'idle',
            disk: 'idle',
            startup: 'idle',
          });
        } else if (currentProgress < 50) {
          setCardStatuses({
            registry: 'optimizing',
            cache: 'scanning',
            disk: 'idle',
            startup: 'idle',
          });
        } else if (currentProgress < 75) {
          setCardStatuses({
            registry: 'complete',
            cache: 'optimizing',
            disk: 'scanning',
            startup: 'idle',
          });
        } else if (currentProgress < 100) {
          setCardStatuses({
            registry: 'complete',
            cache: 'complete',
            disk: 'optimizing',
            startup: 'scanning',
          });
        } else {
          setCardStatuses({
            registry: 'complete',
            cache: 'complete',
            disk: 'complete',
            startup: 'complete',
          });
          setIsOptimizing(false);
          clearInterval(interval);
        }

        // Simular redução de uso de recursos
        if (currentProgress > 20) {
          setCpuUsage(Math.max(20, 45 - currentProgress / 4));
          setMemoryUsage(Math.max(30, 62 - currentProgress / 3));
          setDiskUsage(Math.max(15, 38 - currentProgress / 5));
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOptimizing]);

  const startOptimization = () => {
    setIsOptimizing(true);
    setProgress(0);
    setCpuUsage(45);
    setMemoryUsage(62);
    setDiskUsage(38);
    setCardStatuses({
      registry: 'idle',
      cache: 'idle',
      disk: 'idle',
      startup: 'idle',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
            KNZ PC Optimizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Otimize seu PC com tecnologia avançada
          </p>
        </div>

        {/* System Status */}
        <SystemStatus
          cpuUsage={Math.round(cpuUsage)}
          memoryUsage={Math.round(memoryUsage)}
          diskUsage={Math.round(diskUsage)}
        />

        {/* Progress Section */}
        {isOptimizing && (
          <div className="mb-6 animate-slide-up">
            <ProgressBar
              progress={progress}
              label="Progresso da Otimização"
              animated={true}
            />
          </div>
        )}

        {/* Optimization Button */}
        <div className="text-center mb-8">
          <button
            onClick={startOptimization}
            disabled={isOptimizing}
            className={`
              px-8 py-4 rounded-lg font-semibold text-white text-lg
              transition-all duration-300 transform
              ${
                isOptimizing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 hover:scale-105 hover:shadow-xl'
              }
            `}
          >
            {isOptimizing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Otimizando...
              </span>
            ) : (
              'Iniciar Otimização'
            )}
          </button>
        </div>

        {/* Optimization Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptimizationCard
            icon="🔧"
            title="Registro do Windows"
            description="Limpa entradas inválidas e otimiza o registro"
            status={cardStatuses.registry}
          />
          <OptimizationCard
            icon="🗑️"
            title="Cache do Sistema"
            description="Remove arquivos temporários e cache desnecessário"
            status={cardStatuses.cache}
          />
          <OptimizationCard
            icon="💾"
            title="Disco Rígido"
            description="Desfragmenta e otimiza o armazenamento"
            status={cardStatuses.disk}
          />
          <OptimizationCard
            icon="⚡"
            title="Programas de Inicialização"
            description="Gerencia aplicativos que iniciam com o sistema"
            status={cardStatuses.startup}
          />
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          <p>Sistema monitorado em tempo real • Otimização segura e eficiente</p>
        </div>
      </div>
    </div>
  );
}