import { Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group">
      <img
        src={item.image}
        alt={item.name}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-200 dark:bg-slate-600"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
        <p className="text-[11px] font-medium text-orange-600 dark:text-orange-400">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="p-1 rounded-l-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-white select-none">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="p-1 rounded-r-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <span className="text-xs font-bold text-slate-800 dark:text-white w-14 text-right tabular-nums">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
