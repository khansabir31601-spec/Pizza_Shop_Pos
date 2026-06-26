import { useState, useEffect, useMemo } from 'react';
import { Play, Check, Clock, UtensilsCrossed } from 'lucide-react';
import { generateOrders } from '../../data/orders';
import type { Order } from '../../types';
import StatusBadge from './StatusBadge';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m ago`;
}

type KitchenStatus = 'pending' | 'preparing' | 'ready';

interface KitchenOrder extends Order {
  kitchenStatus: KitchenStatus;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(() =>
    generateOrders(20).map((o) => ({
      ...o,
      kitchenStatus: o.status === 'completed' ? 'ready' : 'pending',
    }))
  );
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  useEffect(() => {
    const interval = setInterval(() => setOrders((prev) => [...prev]), 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let list = orders.filter((o) => o.kitchenStatus !== 'ready' || filter === 'all' || filter === 'ready');
    if (filter !== 'all') {
      list = list.filter((o) => o.kitchenStatus === filter);
    }
    return list;
  }, [orders, filter]);

  const setStatus = (id: string, status: KitchenStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, kitchenStatus: status } : o)));
  };

  const counts = useMemo(() => {
    const p = orders.filter((o) => o.kitchenStatus === 'pending').length;
    const pr = orders.filter((o) => o.kitchenStatus === 'preparing').length;
    const r = orders.filter((o) => o.kitchenStatus === 'ready').length;
    return { pending: p, preparing: pr, ready: r };
  }, [orders]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Kitchen Display</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
            Auto-refresh every 30s
          </span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'preparing', 'ready'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'All Orders' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-70">({f === 'all' ? orders.length : counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className={`rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
              order.kitchenStatus === 'preparing'
                ? 'border-emerald-200 dark:border-emerald-800'
                : order.kitchenStatus === 'ready'
                ? 'border-blue-200 dark:border-blue-800'
                : 'border-amber-200 dark:border-amber-800'
            }`}
          >
            <div
              className={`px-4 py-2.5 flex items-center justify-between ${
                order.kitchenStatus === 'preparing'
                  ? 'bg-emerald-500 text-white'
                  : order.kitchenStatus === 'ready'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <div>
                <p className="text-sm font-bold">{order.invoiceNumber}</p>
                <p className="text-[11px] opacity-80">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] bg-white/20 rounded-lg px-2 py-1">
                <Clock className="w-3 h-3" />
                {timeAgo(order.date)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 space-y-3">
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-orange-500 dark:text-orange-400 mr-1.5">x{item.quantity}</span>
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                <StatusBadge status={order.kitchenStatus === 'ready' ? 'completed' : order.kitchenStatus} />

                <div className="flex gap-1.5">
                  {order.kitchenStatus === 'pending' && (
                    <button
                      onClick={() => setStatus(order.id, 'preparing')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Preparing
                    </button>
                  )}
                  {order.kitchenStatus === 'preparing' && (
                    <button
                      onClick={() => setStatus(order.id, 'ready')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Ready
                    </button>
                  )}
                  {order.kitchenStatus === 'ready' && (
                    <button
                      onClick={() => setStatus(order.id, 'pending')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
          <UtensilsCrossed className="w-12 h-12 mb-3 opacity-50" />
          <p className="font-medium">No orders to display</p>
          <p className="text-sm">All orders have been fulfilled.</p>
        </div>
      )}
    </div>
  );
}
