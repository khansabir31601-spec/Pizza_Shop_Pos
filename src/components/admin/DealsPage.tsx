import { useState, useMemo } from 'react';
import { deals as initialDeals } from '../../data/deals';
import StatusBadge from './StatusBadge';
import type { Deal } from '../../types';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';

const statusFilters = ['All', 'active', 'inactive', 'expired'] as const;

const emptyDeal: Omit<Deal, 'id'> = {
  name: '', description: '', originalPrice: 0, offerPrice: 0,
  image: '', products: [], startDate: '', endDate: '', status: 'active',
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<Omit<Deal, 'id'>>({ ...emptyDeal });

  const filtered = useMemo(() => {
    return deals.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deals, search, statusFilter]);

  const discountPercent = (orig: number, offer: number) => {
    if (orig <= 0) return 0;
    return Math.round(((orig - offer) / orig) * 100);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyDeal });
    setShowModal(true);
  };

  const openEdit = (deal: Deal) => {
    setEditing(deal);
    setForm({ name: deal.name, description: deal.description, originalPrice: deal.originalPrice, offerPrice: deal.offerPrice, image: deal.image, products: deal.products, startDate: deal.startDate, endDate: deal.endDate, status: deal.status });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = () => {
    if (editing) {
      setDeals(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d));
    } else {
      const newDeal: Deal = { id: `deal-${Date.now()}`, ...form };
      setDeals(prev => [newDeal, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const updateForm = (key: keyof Omit<Deal, 'id'>, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Deals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage promotional deals and offers</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)}
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
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Deal Name</th>
                <th className="p-3 font-medium">Original Price</th>
                <th className="p-3 font-medium">Offer Price</th>
                <th className="p-3 font-medium">Discount</th>
                <th className="p-3 font-medium hidden md:table-cell">Products</th>
                <th className="p-3 font-medium hidden lg:table-cell">Start Date</th>
                <th className="p-3 font-medium hidden lg:table-cell">End Date</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(deal => (
                <tr key={deal.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <img src={deal.image} alt={deal.name} className="w-10 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{deal.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 tabular-nums">${deal.originalPrice.toFixed(2)}</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">${deal.offerPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                      {discountPercent(deal.originalPrice, deal.offerPrice)}% OFF
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{deal.products.length}</td>
                  <td className="p-3 text-slate-500 hidden lg:table-cell">{deal.startDate}</td>
                  <td className="p-3 text-slate-500 hidden lg:table-cell">{deal.endDate}</td>
                  <td className="p-3"><StatusBadge status={deal.status} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(deal)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(deal.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="p-6 text-center text-slate-500">No deals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editing ? 'Edit Deal' : 'Add Deal'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={e => updateForm('image', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Original Price</label>
                  <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => updateForm('originalPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Offer Price</label>
                  <input type="number" step="0.01" min="0" value={form.offerPrice} onChange={e => updateForm('offerPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => updateForm('startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => updateForm('endDate', e.target.value)}
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
