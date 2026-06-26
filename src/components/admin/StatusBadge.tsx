interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  refunded: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  'on-leave': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  low: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  adequate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cls = colorMap[status.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} ${cls}`}>
      <span className={`rounded-full ${size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${status === 'active' || status === 'completed' || status === 'paid' || status === 'good' ? 'bg-current' : 'bg-current'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
