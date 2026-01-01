interface SystemStatusProps {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export default function SystemStatus({ cpuUsage, memoryUsage, diskUsage }: SystemStatusProps) {
  const getStatusColor = (usage: number) => {
    if (usage > 80) return 'text-primary-600';
    if (usage > 60) return 'text-warning';
    return 'text-success';
  };

  const getBarColor = (usage: number) => {
    if (usage > 80) return 'from-primary-500 to-primary-700';
    if (usage > 60) return 'from-yellow-500 to-orange-600';
    return 'from-green-500 to-green-700';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
      {/* CPU Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU</span>
          <span className={`text-xl font-bold ${getStatusColor(cpuUsage)}`}>
            {cpuUsage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(cpuUsage)} transition-all duration-500 animate-pulse-slow`}
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>
      </div>

      {/* Memory Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memória</span>
          <span className={`text-xl font-bold ${getStatusColor(memoryUsage)}`}>
            {memoryUsage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(memoryUsage)} transition-all duration-500 animate-pulse-slow`}
            style={{ width: `${memoryUsage}%` }}
          ></div>
        </div>
      </div>

      {/* Disk Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Disco</span>
          <span className={`text-xl font-bold ${getStatusColor(diskUsage)}`}>
            {diskUsage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(diskUsage)} transition-all duration-500 animate-pulse-slow`}
            style={{ width: `${diskUsage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
