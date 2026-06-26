import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { Supplier } from '../../types';
import { suppliers as supplierData } from '../../data/suppliers';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import Modal from './Modal';

const allProducts = [
  'Pizza Dough', 'Tomato Sauce', 'French Fries', 'Flour',
  'Mozzarella Cheese', 'Ice Cream', 'Milk', 'Butter',
  'Pepperoni', 'Chicken Breast', 'Beef Patties', 'Bacon',
  'Burger Buns', 'Chocolate Brownies', 'Bread',
  'Lettuce', 'Tomatoes', 'Onions', 'Bell Peppers',
  'Coca-Cola Syrup', 'Lemonade Mix', 'Iced Tea',
  'Cooking Oil', 'Sugar', 'Spices', 'Packaging',
  'Salmon', 'Shrimp', 'Cod',
];

const defaultForm = {
  company: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  productsSupplied: [] as string[],
  status: 'active' as 'active' | 'inactive',
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(supplierData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const filtered = useMemo(() => {
    let list = suppliers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.company.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter((s) => s.status === statusFilter);
    }
    return list;
  }, [suppliers, search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditingId(s.id);
    setForm({
      company: s.company,
      contactPerson: s.contactPerson,
      phone: s.phone,
      email: s.email,
      address: s.address,
      productsSupplied: [...s.productsSupplied],
      status: s.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      const newId = `sup-${Date.now()}`;
      setSuppliers((prev) => [...prev, { id: newId, ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this supplier?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleProduct = (product: string) => {
    setForm((prev) => ({
      ...prev,
      productsSupplied: prev.productsSupplied.includes(product)
        ? prev.productsSupplied.filter((p) => p !== product)
        : [...prev.productsSupplied, product],
    }));
  };

  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (s: Supplier) => (
        <span className="font-medium text-slate-800 dark:text-white">{s.company}</span>
      ),
    },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email', className: 'hidden lg:table-cell' },
    {
      key: 'productsSupplied',
      header: 'Products Supplied',
      className: 'hidden md:table-cell',
      render: (s: Supplier) => (
        <span className="text-slate-600 dark:text-slate-400 text-xs">
          {s.productsSupplied.join(', ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: Supplier) => <StatusBadge status={s.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (s: Supplier) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(s); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-16',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Suppliers</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or contact person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          pageSize={10}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Supplier' : 'Add Supplier'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Contact Person</label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Products Supplied</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-600 rounded-lg">
              {allProducts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProduct(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    form.productsSupplied.includes(p)
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, status: form.status === 'active' ? 'inactive' : 'active' })}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                form.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  form.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {form.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Supplier
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
