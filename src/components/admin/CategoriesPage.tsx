import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { categories as initialCategories } from '../../data/categories';
import type { Category } from '../../types';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import DataTable from './DataTable';
import type { Column } from './DataTable';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  );

  const openAdd = () => {
    setEditItem(null);
    setFormName('');
    setFormDesc('');
    setFormImage('');
    setFormStatus('active');
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditItem(cat);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormImage(cat.image);
    setFormStatus(cat.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editItem) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editItem.id
            ? { ...c, name: formName.trim(), description: formDesc.trim(), image: formImage.trim(), status: formStatus }
            : c,
        ),
      );
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        image: formImage.trim() || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
        productCount: 0,
        status: formStatus,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const columns: Column[] = [
    {
      key: 'image',
      header: 'Image',
      render: (cat: Category) => (
        <img
          src={cat.image}
          alt={cat.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
        />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (cat: Category) => <span className="font-medium text-slate-800 dark:text-white">{cat.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      className: 'hidden sm:table-cell',
      render: (cat: Category) => <span className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1">{cat.description}</span>,
    },
    {
      key: 'productCount',
      header: 'Product Count',
      render: (cat: Category) => <span className="text-slate-600 dark:text-slate-300">{cat.productCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (cat: Category) => <StatusBadge status={cat.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      render: (cat: Category) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(cat)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(cat.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(cat: Category) => cat.id}
          pageSize={20}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <button
              type="button"
              onClick={() => setFormStatus(formStatus === 'active' ? 'inactive' : 'active')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formStatus === 'active' ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formStatus === 'active' ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-xs font-medium ${formStatus === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {formStatus === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editItem ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
