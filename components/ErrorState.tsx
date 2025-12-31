import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="p-4 rounded-full bg-red-500/10 mb-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">Error</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all duration-300 hover:scale-105"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
