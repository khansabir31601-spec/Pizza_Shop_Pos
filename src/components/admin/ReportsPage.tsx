import { useState, useMemo } from 'react';
import { salesData } from '../../data/salesData';
import { recentOrders } from '../../data/orders';
import { products } from '../../data/products';
import { expenses } from '../../data/expenses';
import {
  TrendingUp, TrendingDown, DollarSign,
  FileText, FileSpreadsheet, Printer, Sun, Moon,
  Pizza, Beef, Coffee, Utensils
} from 'lucide-react';

type ReportTab = 'daily' | 'weekly' | 'monthly' | 'products' | 'categories' | 'profit';

const tabs: { id: ReportTab; label: string }[] = [
  { id: 'daily', label: 'Daily Sales' },
  { id: 'weekly', label: 'Weekly Sales' },
  { id: 'monthly', label: 'Monthly Sales' },
  { id: 'products', label: 'Product Sales' },
  { id: 'categories', label: 'Category Sales' },
  { id: 'profit', label: 'Profit Report' },
];

const categoryIcons: Record<string, typeof Pizza> = {
  Pizza, Burgers: Beef, Fries: Utensils, Drinks: Coffee,
  Chicken: Utensils, Desserts: Coffee, Salads: Utensils, Extras: Utensils,
};

function formatCurrency(v: number) {
  return '$' + v.toFixed(2);
}

function summaryCard(label: string, value: string, trend?: { up: boolean; pct: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend.pct}% vs last period</span>
        </div>
      )}
    </div>
  );
}

function Bar({ h, label, value, max, color }: { h: number; label: string; value: string; max: number; color: string }) {
  const pct = max > 0 ? (h / max) * 100 : 0;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{value}</span>
      <div className="w-full rounded-t-md" style={{ height: `${Math.max(pct, 2)}%`, backgroundColor: color }} />
      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full text-center">{label}</span>
    </div>
  );
}

function BarChartHorizontal({ items, color }: { items: { label: string; value: number; color?: string }[]; color: string }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
            <span className="font-semibold text-slate-800 dark:text-white tabular-nums">{formatCurrency(item.value)}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const today = new Date();

  const dailyData = useMemo(() => {
    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const td = salesData.find(d => d.date === todayStr);
    const yd = salesData.find(d => d.date === yesterdayStr);
    return { today: td, yesterday: yd };
  }, []);

  const weeklyData = useMemo(() => {
    const getWeekRange = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(d.setDate(diff));
      const sun = new Date(mon);
      sun.setDate(sun.getDate() + 6);
      return { start: mon.toISOString().slice(0, 10), end: sun.toISOString().slice(0, 10) };
    };
    const thisWeek = getWeekRange(today);
    const lastWeekStart = new Date(thisWeek.start);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeek.start);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    const lastWeek = { start: lastWeekStart.toISOString().slice(0, 10), end: lastWeekEnd.toISOString().slice(0, 10) };
    const thisSales = salesData.filter(d => d.date >= thisWeek.start && d.date <= thisWeek.end);
    const lastSales = salesData.filter(d => d.date >= lastWeek.start && d.date <= lastWeek.end);
    return {
      thisWeek: { amount: thisSales.reduce((s, d) => s + d.amount, 0), orders: thisSales.reduce((s, d) => s + d.orders, 0) },
      lastWeek: { amount: lastSales.reduce((s, d) => s + d.amount, 0), orders: lastSales.reduce((s, d) => s + d.orders, 0) },
    };
  }, []);

  const monthlyData = useMemo(() => {
    const thisMonth = today.getMonth() + 1;
    const thisYear = today.getFullYear();
    const thisMonthStr = `${thisYear}-${String(thisMonth).padStart(2, '0')}`;
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;
    const lastMonthStr = `${lastMonthYear}-${String(lastMonth).padStart(2, '0')}`;
    const thisM = salesData.filter(d => d.date.startsWith(thisMonthStr));
    const lastM = salesData.filter(d => d.date.startsWith(lastMonthStr));
    return {
      thisMonth: { amount: thisM.reduce((s, d) => s + d.amount, 0), orders: thisM.reduce((s, d) => s + d.orders, 0) },
      lastMonth: { amount: lastM.reduce((s, d) => s + d.amount, 0), orders: lastM.reduce((s, d) => s + d.orders, 0) },
      dailyBars: thisM.length > 0 ? thisM : [],
    };
  }, []);

  const productSalesData = useMemo(() => {
    const map = new Map<string, number>();
    recentOrders.forEach(o => {
      o.items.forEach(item => {
        map.set(item.name, (map.get(item.name) || 0) + item.price * item.quantity);
      });
    });
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, []);

  const categorySalesData = useMemo(() => {
    const map = new Map<string, number>();
    recentOrders.forEach(o => {
      o.items.forEach(item => {
        const cat = products.find(p => p.name === item.name)?.category || 'Other';
        map.set(cat, (map.get(cat) || 0) + item.price * item.quantity);
      });
    });
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, []);

  const profitData = useMemo(() => {
    const totalRevenue = salesData.reduce((s, d) => s + d.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalExpenses, profit, margin };
  }, []);

  const renderSummaryCards = (items: { label: string; value: string; trend?: { up: boolean; pct: number } }[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, i) => (
        <div key={i}>{summaryCard(item.label, item.value, item.trend)}</div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily': {
        const td = dailyData.today;
        const yd = dailyData.yesterday;
        const tdAmt = td?.amount || 0;
        const ydAmt = yd?.amount || 0;
        const trend = ydAmt > 0 ? { up: tdAmt >= ydAmt, pct: Math.round(Math.abs((tdAmt - ydAmt) / ydAmt) * 100) } : undefined;
        return (
          <div>
            {renderSummaryCards([
              { label: 'Today Sales', value: formatCurrency(tdAmt), trend },
              { label: 'Orders Today', value: String(td?.orders || 0) },
              { label: 'Yesterday Sales', value: formatCurrency(ydAmt) },
              { label: 'Orders Yesterday', value: String(yd?.orders || 0) },
            ])}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Hourly Sales Trend</h3>
              <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 12 }).map((_, i) => {
                  const h = (tdAmt / 12) * (0.5 + Math.random() * 1);
                  return <Bar key={i} h={h} label={`${i + 8}`} value={formatCurrency(h)} max={tdAmt} color="#f97316" />;
                })}
              </div>
            </div>
          </div>
        );
      }
      case 'weekly': {
        const tw = weeklyData.thisWeek;
        const lw = weeklyData.lastWeek;
        const trend = lw.amount > 0 ? { up: tw.amount >= lw.amount, pct: Math.round(Math.abs((tw.amount - lw.amount) / lw.amount) * 100) } : undefined;
        return (
          <div>
            {renderSummaryCards([
              { label: 'This Week', value: formatCurrency(tw.amount), trend },
              { label: 'Orders This Week', value: String(tw.orders) },
              { label: 'Last Week', value: formatCurrency(lw.amount) },
              { label: 'Orders Last Week', value: String(lw.orders) },
            ])}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">This Week vs Last Week</h3>
              <div className="flex items-end gap-2 h-40">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const idx = today.getDate() - today.getDay() + i + (today.getDay() === 0 ? -6 : 1);
                  const dateStr = new Date(today.getFullYear(), today.getMonth(), idx).toISOString().slice(0, 10);
                  const dayData = salesData.find(d => d.date === dateStr);
                  const amt = dayData?.amount || 0;
                  return <Bar key={i} h={amt} label={day} value={formatCurrency(amt)} max={tw.amount} color="#f97316" />;
                })}
              </div>
            </div>
          </div>
        );
      }
      case 'monthly': {
        const tm = monthlyData.thisMonth;
        const lm = monthlyData.lastMonth;
        const trend = lm.amount > 0 ? { up: tm.amount >= lm.amount, pct: Math.round(Math.abs((tm.amount - lm.amount) / lm.amount) * 100) } : undefined;
        return (
          <div>
            {renderSummaryCards([
              { label: 'This Month', value: formatCurrency(tm.amount), trend },
              { label: 'Orders This Month', value: String(tm.orders) },
              { label: 'Last Month', value: formatCurrency(lm.amount) },
              { label: 'Orders Last Month', value: String(lm.orders) },
            ])}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Daily Sales This Month</h3>
              <div className="flex items-end gap-1 h-40">
                {monthlyData.dailyBars.map((d, i) => (
                  <Bar key={i} h={d.amount} label={d.date.slice(8)} value={formatCurrency(d.amount)} max={tm.amount} color="#f97316" />
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'products': {
        const topProducts = productSalesData.slice(0, 10);

        return (
          <div>
            {renderSummaryCards([
              { label: 'Top Product', value: topProducts[0]?.name || 'N/A' },
              { label: 'Top Revenue', value: formatCurrency(topProducts[0]?.amount || 0) },
              { label: 'Total Products Sold', value: String(productSalesData.length) },
              { label: 'Total Revenue', value: formatCurrency(productSalesData.reduce((s, p) => s + p.amount, 0)) },
            ])}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Product Sales Breakdown</h3>
              <BarChartHorizontal items={topProducts.map(p => ({ label: p.name, value: p.amount }))} color="#f97316" />
            </div>
          </div>
        );
      }
      case 'categories': {
        return (
          <div>
            {renderSummaryCards([
              { label: 'Top Category', value: categorySalesData[0]?.name || 'N/A' },
              { label: 'Top Category Revenue', value: formatCurrency(categorySalesData[0]?.amount || 0) },
              { label: 'Categories', value: String(categorySalesData.length) },
              { label: 'Total', value: formatCurrency(categorySalesData.reduce((s, c) => s + c.amount, 0)) },
            ])}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Category Sales Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BarChartHorizontal items={categorySalesData.map(c => ({ label: c.name, value: c.amount }))} color="#f97316" />
                <div className="grid grid-cols-2 gap-3">
                  {categorySalesData.map((cat, i) => {
                    const total = categorySalesData.reduce((s, c) => s + c.amount, 0);
                    const pct = total > 0 ? (cat.amount / total) * 100 : 0;
                    const Icon = categoryIcons[cat.name] || DollarSign;
                    return (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{cat.name}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(cat.amount)} ({pct.toFixed(1)}%)</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'profit': {
        const pd = profitData;
        const marginColor = pd.margin >= 20 ? 'text-emerald-600' : pd.margin >= 10 ? 'text-amber-600' : 'text-red-600';
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">{formatCurrency(pd.totalRevenue)}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1 tabular-nums">{formatCurrency(pd.totalExpenses)}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Profit</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1 tabular-nums">{formatCurrency(pd.profit)}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profit Margin</p>
                <p className={`text-2xl font-bold mt-1 tabular-nums ${marginColor}`}>{pd.margin.toFixed(1)}%</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Revenue vs Expenses</h3>
              <div className="flex items-end gap-4 h-40">
                <div className="flex-1 flex items-end gap-2">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-emerald-600">{formatCurrency(pd.totalRevenue)}</span>
                    <div className="w-full rounded-t-md bg-emerald-500" style={{ height: '100%' }} />
                    <span className="text-xs text-slate-500">Revenue</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-red-600">{formatCurrency(pd.totalExpenses)}</span>
                    <div className="w-full rounded-t-md bg-red-500" style={{ height: `${(pd.totalExpenses / pd.totalRevenue) * 100}%` }} />
                    <span className="text-xs text-slate-500">Expenses</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">{formatCurrency(pd.profit)}</span>
                    <div className="w-full rounded-t-md bg-orange-500" style={{ height: `${pd.totalRevenue > 0 ? Math.max((pd.profit / pd.totalRevenue) * 100, 0) : 0}%` }} />
                    <span className="text-xs text-slate-500">Profit</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Expense Breakdown</h3>
              <BarChartHorizontal
                items={expenses.map(e => ({ label: e.category, value: e.amount }))}
                color="#ef4444"
              />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and analyze sales performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => alert('Exporting PDF...')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => alert('Exporting Excel...')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">From:</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">To:</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
        </div>
        {(fromDate || toDate) && (
          <button onClick={() => { setFromDate(''); setToDate(''); }}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium">
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-orange-500 border-orange-500'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
