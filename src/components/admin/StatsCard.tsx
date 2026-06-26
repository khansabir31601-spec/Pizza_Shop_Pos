import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  color?: string;
}

const colorMap: Record<string, { from: string; to: string; shadow: string }> = {
  orange: { from: 'from-orange-500', to: 'to-red-600', shadow: 'shadow-orange-500/20' },
  blue: { from: 'from-blue-500', to: 'to-blue-600', shadow: 'shadow-blue-500/20' },
  green: { from: 'from-emerald-500', to: 'to-emerald-600', shadow: 'shadow-emerald-500/20' },
  purple: { from: 'from-purple-500', to: 'to-purple-600', shadow: 'shadow-purple-500/20' },
  pink: { from: 'from-pink-500', to: 'to-pink-600', shadow: 'shadow-pink-500/20' },
  cyan: { from: 'from-cyan-500', to: 'to-cyan-600', shadow: 'shadow-cyan-500/20' },
  yellow: { from: 'from-yellow-500', to: 'to-amber-600', shadow: 'shadow-yellow-500/20' },
  red: { from: 'from-red-500', to: 'to-red-600', shadow: 'shadow-red-500/20' },
};

export default function StatsCard({ icon: Icon, label, value, trend, color = 'orange' }: StatsCardProps) {
  const c = colorMap[color] || colorMap.orange;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend.value}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center shadow-lg ${c.shadow} flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
