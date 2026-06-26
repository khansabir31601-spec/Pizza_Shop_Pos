import { Receipt } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}

export default function OrderSummary({ subtotal, discount, tax, grandTotal }: OrderSummaryProps) {
  return (
    <div className="px-3 pt-3 pb-2 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-2.5">
        <Receipt className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Order Summary</h3>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
          <span>Discount (10%)</span>
          <span className="tabular-nums">-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Tax (8%)</span>
          <span className="tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-800 dark:text-white">Grand Total</span>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400 tabular-nums">${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
