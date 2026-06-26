import { useState, useMemo } from 'react';
import { coupons as initialCoupons } from '../../data/coupons';
import StatusBadge from './StatusBadge';
import type { Coupon } from '../../types';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';

const statusFilters = ['All', 'active', 'inactive', 'expired'] as const;
const emptyCoupon: Omit<Coupon, 'id'> = {
  code: '', discount: 0, type: 'percentage',
  expiry: '', usageLimit: 100, usedCount: 0, status: 'active',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Omit<Coupon, 'id'>>({ ...emptyCoupon });

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [coupons, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyCoupon });
    setShowModal(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({ code: c.code, discount: c.discount, type: c.type, expiry: c.expiry, usageLimit: c.usageLimit, usedCount: c.usedCount, status: c.status });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (editing) {
      setCoupons(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const newCoupon: Coupon = { id: `cpn-${Date.now()}`, ...form };
      setCoupons(prev => [newCoupon, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const updateForm = (key: keyof Omit<Coupon, 'id'>, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Coupons</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage discount coupons and promo codes</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by code..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
        </div>
        <div className="flex gap-1">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}>
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr className="text-left text-slate-500">
                <th className="p-3 font-medium">Code</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Discount Value</th>
                <th className="p-3 font-medium">Expiry</th>
                <th className="p-3 font-medium">Usage</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(coupon => (
                <tr key={coupon.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <span className="font-bold font-mono text-slate-800 dark:text-white">{coupon.code}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      coupon.type === 'percentage'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {coupon.type === 'percentage' ? '%' : '$'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-white tabular-nums">
                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount.toFixed(2)}`}
                  </td>
                  <td className="p-3 text-slate-500 tabular-nums">{coupon.expiry}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-20">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${coupon.usageLimit > 0 ? (coupon.usedCount / coupon.usageLimit) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        {coupon.usedCount}/{coupon.usageLimit}
                      </span>
                    </div>
                  </td>
                  <td className="p-3"><StatusBadge status={coupon.status} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(coupon)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">No coupons found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editing ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Code</label>
                <input type="text" value={form.code} onChange={e => updateForm('code', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                  <select value={form.type} onChange={e => updateForm('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Discount Value</label>
                  <input type="number" step="0.01" min="0" value={form.discount} onChange={e => updateForm('discount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Expiry Date</label>
                <input type="date" value={form.expiry} onChange={e => updateForm('expiry', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Usage Limit</label>
                  <input type="number" min="1" value={form.usageLimit} onChange={e => updateForm('usageLimit', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Used Count</label>
                  <input type="number" min="0" value={form.usedCount} onChange={e => updateForm('usedCount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select value={form.status} onChange={e => updateForm('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
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
