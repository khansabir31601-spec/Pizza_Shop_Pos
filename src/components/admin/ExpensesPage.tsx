import { useState, useMemo } from 'react';
import { expenses as initialExpenses } from '../../data/expenses';
import { expenseCategories } from '../../data/expenseCategories';
import type { Expense } from '../../types';
import { Plus, Pencil, Trash2, X, DollarSign, TrendingUp, CalendarDays } from 'lucide-react';

const emptyExpense: Omit<Expense, 'id'> = {
  category: expenseCategories[0], amount: 0, date: new Date().toISOString().slice(0, 10),
  description: '', paymentMethod: 'Card',
};

function formatCurrency(v: number) {
  return '$' + v.toFixed(2);
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState<Omit<Expense, 'id'>>({ ...emptyExpense });

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;
      return true;
    });
  }, [expenses, categoryFilter, fromDate, toDate]);

  const summary = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const catMap = new Map<string, number>();
    expenses.forEach(e => catMap.set(e.category, (catMap.get(e.category) || 0) + e.amount));
    let highestCat = '';
    let highestAmt = 0;
    catMap.forEach((amt, cat) => {
      if (amt > highestAmt) { highestAmt = amt; highestCat = cat; }
    });
    const months = new Set(expenses.map(e => e.date.slice(0, 7)));
    const monthlyAvg = months.size > 0 ? total / months.size : 0;
    return { total, highestCat, highestAmt, monthlyAvg };
  }, [expenses]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyExpense, date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditing(e);
    setForm({ category: e.category, amount: e.amount, date: e.date, description: e.description, paymentMethod: e.paymentMethod });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (editing) {
      setExpenses(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e));
    } else {
      const newExpense: Expense = { id: `exp-${Date.now()}`, ...form };
      setExpenses(prev => [newExpense, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const updateForm = (key: keyof Omit<Expense, 'id'>, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage business expenses</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Expenses</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{formatCurrency(summary.total)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highest Category</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{summary.highestCat || 'N/A'}</p>
              {summary.highestCat && <p className="text-xs text-slate-500">{formatCurrency(summary.highestAmt)}</p>}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Monthly</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{formatCurrency(summary.monthlyAvg)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white">
          <option value="All">All Categories</option>
          {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
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
        {(categoryFilter !== 'All' || fromDate || toDate) && (
          <button onClick={() => { setCategoryFilter('All'); setFromDate(''); setToDate(''); }}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium">
            Clear
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr className="text-left text-slate-500">
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(expense => (
                <tr key={expense.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-white tabular-nums">{formatCurrency(expense.amount)}</td>
                  <td className="p-3 text-slate-500 tabular-nums">{expense.date}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{expense.description}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(expense)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No expenses found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editing ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select value={form.category} onChange={e => updateForm('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white">
                  {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                <input type="number" step="0.01" min="0" value={form.amount} onChange={e => updateForm('amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Payment Method</label>
                <select value={form.paymentMethod} onChange={e => updateForm('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">{editing ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
