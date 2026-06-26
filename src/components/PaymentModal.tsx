import { useState } from 'react';
import { X, Wallet, CreditCard, QrCode, Printer, DollarSign } from 'lucide-react';
import type { PaymentMethod } from '../types';

interface PaymentModalProps {
  grandTotal: number;
  onConfirm: (method: PaymentMethod, amountReceived: number) => void;
  onCancel: () => void;
}

export default function PaymentModal({ grandTotal, onConfirm, onCancel }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [amountReceived, setAmountReceived] = useState(Math.ceil(grandTotal));
  const change = parseFloat((amountReceived - grandTotal).toFixed(2));

  const quickAmounts = [Math.ceil(grandTotal), Math.ceil(grandTotal / 5 + 1) * 5, Math.ceil(grandTotal / 10 + 1) * 10, Math.ceil(grandTotal / 20 + 1) * 20, Math.ceil(grandTotal / 50 + 1) * 50];

  const handleConfirm = () => {
    onConfirm(method, method === 'Cash' ? amountReceived : grandTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Payment</h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center py-4 px-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-100 dark:border-orange-800/20">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">${grandTotal.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'Card', 'QR Payment'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150 ${
                    method === m
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {m === 'Cash' ? <Wallet className="w-5 h-5" /> : m === 'Card' ? <CreditCard className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                  <span className="text-[11px] font-semibold">{m === 'QR Payment' ? 'QR Pay' : m}</span>
                </button>
              ))}
            </div>
          </div>

          {method === 'Cash' && (
            <div className="animate-slideUp">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Amount Received</p>
              <div className="relative mb-2">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent tabular-nums"
                  step="0.01"
                  min={grandTotal}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {quickAmounts.map((amt, i) => (
                  <button
                    key={i}
                    onClick={() => setAmountReceived(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      Math.abs(amountReceived - amt) < 0.01
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
              </div>
              {change >= 0 && (
                <div className="flex justify-between items-center mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Change Due</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 p-3 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={method === 'Cash' && amountReceived < grandTotal}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" />
            Confirm & Print
          </button>
        </div>
      </div>
    </div>
  );
}
