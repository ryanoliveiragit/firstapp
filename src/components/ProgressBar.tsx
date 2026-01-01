interface ProgressBarProps {
  progress: number;
  label: string;
  animated?: boolean;
}

export default function ProgressBar({ progress, label, animated = true }: ProgressBarProps) {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-500 ${
            animated ? 'animate-pulse-slow' : ''
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
