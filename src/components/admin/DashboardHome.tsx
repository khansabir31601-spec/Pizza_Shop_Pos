import { useMemo } from 'react';
import type { Order } from '../../types';
import { recentOrders } from '../../data/orders';
import { salesData } from '../../data/salesData';
import { inventory } from '../../data/inventory';
import { expenses } from '../../data/expenses';
import StatsCard from './StatsCard';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import {
  DollarSign, TrendingUp, Calendar, ShoppingBag,
  Landmark, ArrowDownCircle, AlertTriangle,
} from 'lucide-react';

const user = { name: 'Sarah Johnson', role: 'admin' };

export default function DashboardHome() {
  const {
    todaySales, weeklySales, monthlySales, totalOrders,
    revenue, expenseTotal, profit, lowStockItems,
  } = useMemo(() => {
    const orders = recentOrders as Order[];
    const now = new Date();
    const todayStr = now.toDateString();

    const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === todayStr);
    const last7 = new Date(now.getTime() - 7 * 86400000);
    const last30 = new Date(now.getTime() - 30 * 86400000);
    const weekOrders = orders.filter((o) => new Date(o.date) >= last7);
    const monthOrders = orders.filter((o) => new Date(o.date) >= last30);

    const totalRev = orders.reduce((s, o) => s + o.grandTotal, 0);
    const expTotal = expenses.reduce((s, e) => s + e.amount, 0);

    return {
      todaySales: todayOrders.reduce((s, o) => s + o.grandTotal, 0),
      weeklySales: weekOrders.reduce((s, o) => s + o.grandTotal, 0),
      monthlySales: monthOrders.reduce((s, o) => s + o.grandTotal, 0),
      totalOrders: orders.length,
      revenue: totalRev,
      expenseTotal: expTotal,
      profit: totalRev - expTotal,
      lowStockItems: inventory.filter((i) => i.stock <= i.minStock).length,
    };
  }, []);

  const last14 = useMemo(() => {
    const sorted = [...salesData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.slice(-14);
  }, []);

  const maxAmount = Math.max(...last14.map((d) => d.amount));

  const topProducts = [
    { name: 'Margherita Pizza', sales: 4230 },
    { name: 'Pepperoni Pizza', sales: 3850 },
    { name: 'Classic Cheeseburger', sales: 2980 },
    { name: 'Fried Chicken (6pc)', sales: 2560 },
    { name: 'BBQ Chicken Pizza', sales: 2150 },
  ];
  const topMax = Math.max(...topProducts.map((p) => p.sales));

  const paymentData = [
    { method: 'Cash', pct: 45, color: 'bg-emerald-500' },
    { method: 'Card', pct: 35, color: 'bg-blue-500' },
    { method: 'QR Payment', pct: 20, color: 'bg-purple-500' },
  ];

  const recentFive = (recentOrders as Order[]).slice(0, 5);

  const orderColumns = [
    { key: 'invoiceNumber', header: 'Invoice', className: 'font-medium text-slate-800 dark:text-white' },
    { key: 'customerName', header: 'Customer', className: 'text-slate-600 dark:text-slate-300' },
    {
      key: 'grandTotal', header: 'Amount', className: 'font-semibold text-slate-800 dark:text-white',
      render: (o: Order) => `$${o.grandTotal.toFixed(2)}`,
    },
    {
      key: 'paymentMethod', header: 'Payment',
      render: (o: Order) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          o.paymentMethod === 'Cash' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
          o.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
          'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
        }`}>{o.paymentMethod}</span>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (o: Order) => <StatusBadge status={o.status} size="sm" />,
    },
    {
      key: 'date', header: 'Date',
      render: (o: Order) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={DollarSign} label="Today's Sales" value={`$${todaySales.toFixed(2)}`} color="green" />
        <StatsCard icon={TrendingUp} label="Weekly Sales" value={`$${weeklySales.toFixed(2)}`} color="blue" />
        <StatsCard icon={Calendar} label="Monthly Sales" value={`$${monthlySales.toFixed(2)}`} color="purple" />
        <StatsCard icon={ShoppingBag} label="Total Orders" value={totalOrders} color="orange" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Landmark} label="Revenue" value={`$${revenue.toFixed(2)}`} color="green" />
        <StatsCard icon={ArrowDownCircle} label="Expenses" value={`$${expenseTotal.toFixed(2)}`} color="red" />
        <StatsCard icon={TrendingUp} label="Profit" value={`$${profit.toFixed(2)}`} color="green" trend={{ value: 12.5, positive: profit > 0 }} />
        <StatsCard icon={AlertTriangle} label="Low Stock Items" value={lowStockItems} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Sales Trend</h3>
            <div className="flex items-end gap-2 h-40">
              {last14.map((d) => {
                const pct = (d.amount / maxAmount) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute bottom-7 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      ${d.amount.toFixed(0)}
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 transition-all duration-300 hover:opacity-80"
                      style={{ height: `${Math.max(pct, 3)}%` }}
                    />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 -rotate-45 origin-left whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Recent Orders</h3>
              <span className="text-xs text-slate-400">{recentFive.length} orders</span>
            </div>
            <DataTable columns={orderColumns} data={recentFive} keyExtractor={(o: Order) => o.id} pageSize={5} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {topProducts.map((p) => {
                const pct = (p.sales / topMax) * 100;
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{p.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">${p.sales.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Payment Methods</h3>
            <div className="flex items-center justify-center gap-1 mb-4">
              {paymentData.map((p) => (
                <div key={p.method} className="flex-1 text-center">
                  <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-600" />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke={p.color.replace('bg-', '').replace('emerald', '#10b981').replace('blue', '#3b82f6').replace('purple', '#8b5cf6')}
                        strokeWidth="3"
                        strokeDasharray={`${p.pct} ${100 - p.pct}`}
                        strokeDashoffset="0"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                      {p.pct}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.method}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {paymentData.map((p) => (
                <div key={p.method} className="flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-slate-600 dark:text-slate-400">{p.method}</span>
                  <span className="ml-auto font-medium text-slate-700 dark:text-slate-300">{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
