import { useState, useMemo } from 'react';
import type { Product } from '../../types';
import { products, categories } from '../../data/products';
import StatusBadge from './StatusBadge';
import DataTable from './DataTable';
import {
  Search, Plus, Pencil, Trash2, Copy,
  X, Filter, ChevronDown,
} from 'lucide-react';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  cost: string;
  category: string;
  sku: string;
  stock: string;
  status: 'active' | 'inactive';
  image: string;
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', cost: '',
  category: 'Pizza', sku: '', stock: '0', status: 'active', image: '',
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }
    return result;
  }, [search, categoryFilter, statusFilter]);

  const openNew = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      cost: String(product.cost),
      category: product.category,
      sku: product.sku,
      stock: String(product.stock),
      status: product.status,
      image: product.image,
    });
    setShowModal(true);
  };

  const columns = [
    {
      key: 'image', header: 'Image',
      render: (p: Product) => (
        <img
          src={p.image}
          alt={p.name}
          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-700"
          onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
        />
      ),
    },
    {
      key: 'name', header: 'Name', className: 'font-medium text-slate-800 dark:text-white min-w-[140px]',
      render: (p: Product) => (
        <div>
          <p className="font-medium text-slate-800 dark:text-white">{p.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[180px]">{p.description}</p>
        </div>
      ),
    },
    {
      key: 'sku', header: 'SKU', className: 'text-slate-500 dark:text-slate-400 font-mono text-xs',
    },
    {
      key: 'category', header: 'Category', className: 'hidden md:table-cell',
      render: (p: Product) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {p.category}
        </span>
      ),
    },
    {
      key: 'price', header: 'Price', className: 'font-semibold text-slate-800 dark:text-white',
      render: (p: Product) => `Rs. ${p.price.toFixed(2)}`,
    },
    {
      key: 'cost', header: 'Cost', className: 'text-slate-500 dark:text-slate-400 hidden sm:table-cell',
      render: (p: Product) => `Rs. ${p.cost.toFixed(2)}`,
    },
    {
      key: 'stock', header: 'Stock', className: 'text-center',
      render: (p: Product) => (
        <span className={`font-semibold ${
          p.stock <= 10 ? 'text-red-600 dark:text-red-400' :
          p.stock <= 25 ? 'text-amber-600 dark:text-amber-400' :
          'text-emerald-600 dark:text-emerald-400'
        }`}>{p.stock}</span>
      ),
    },
    {
      key: 'status', header: 'Status', className: 'hidden sm:table-cell',
      render: (p: Product) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: 'lastUpdated', header: 'Updated', className: 'text-xs text-slate-400 dark:text-slate-500 hidden lg:table-cell',
    },
    {
      key: 'actions', header: 'Actions', className: 'text-right',
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(p); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filtered.length} products</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p: Product) => p.id}
          pageSize={20}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Product description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Cost (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. PZ-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <div className="flex items-center gap-3 h-full pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={form.status === 'active'}
                        onChange={() => setForm({ ...form, status: 'active' })}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={form.status === 'inactive'}
                        onChange={() => setForm({ ...form, status: 'inactive' })}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {editProduct ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
