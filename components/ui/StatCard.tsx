import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 p-[1px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 animate-fade-in">
      <div className="relative h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
              <Icon className="w-6 h-6 text-purple-400" />
            </div>
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
