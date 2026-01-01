import { ReactNode } from 'react';

interface OptimizationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  status: 'idle' | 'scanning' | 'optimizing' | 'complete';
  animate?: boolean;
}

export default function OptimizationCard({
  icon,
  title,
  description,
  status,
  animate = true
}: OptimizationCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'scanning':
        return 'border-primary-400 bg-primary-50 dark:bg-primary-900/20';
      case 'optimizing':
        return 'border-primary-600 bg-primary-100 dark:bg-primary-800/30 animate-glow';
      case 'complete':
        return 'border-success bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'scanning':
        return 'Escaneando...';
      case 'optimizing':
        return 'Otimizando...';
      case 'complete':
        return 'Completo';
      default:
        return 'Pronto';
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-300
        ${getStatusColor()}
        ${animate ? 'animate-slide-up' : ''}
        hover:shadow-lg hover:scale-105
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          text-4xl
          ${status === 'scanning' ? 'animate-scan' : ''}
          ${status === 'optimizing' ? 'animate-optimize' : ''}
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          <div className="mt-2">
            <span className={`
              text-xs font-medium px-2 py-1 rounded
              ${status === 'scanning' ? 'bg-primary-200 text-primary-800' : ''}
              ${status === 'optimizing' ? 'bg-primary-300 text-primary-900' : ''}
              ${status === 'complete' ? 'bg-green-200 text-green-800' : ''}
              ${status === 'idle' ? 'bg-gray-200 text-gray-800' : ''}
            `}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
