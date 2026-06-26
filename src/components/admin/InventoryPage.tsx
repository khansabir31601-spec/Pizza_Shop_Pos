import { useState, useMemo } from 'react';
import {
  Plus, Search, Pencil, RefreshCw, Clock, AlertTriangle, X,
} from 'lucide-react';
import { inventory as initialInventory } from '../../data/inventory';
import { categories } from '../../data/categories';
import type { InventoryItem } from '../../types';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import DataTable from './DataTable';
import type { Column } from './DataTable';

type StockLevel = 'low' | 'adequate' | 'good';

function getStockLevel(item: InventoryItem): StockLevel {
  if (item.stock <= item.minStock) return 'low';
  if (item.stock <= item.minStock * 2) return 'adequate';
  return 'good';
}

const stockLabel: Record<StockLevel, string> = {
  low: 'Low',
  adequate: 'Adequate',
  good: 'Good',
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<StockLevel | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [message, setMessage] = useState('');

  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStock, setFormStock] = useState(0);
  const [formMinStock, setFormMinStock] = useState(0);
  const [formMaxStock, setFormMaxStock] = useState(0);
  const [formSupplier, setFormSupplier] = useState('');
  const [formCost, setFormCost] = useState(0);
  const [formUnit, setFormUnit] = useState('');

  const filtered = useMemo(() => {
    let result = items;
    const q = search.toLowerCase();
    if (q) result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    if (categoryFilter) result = result.filter((i) => i.category === categoryFilter);
    if (stockFilter) result = result.filter((i) => getStockLevel(i) === stockFilter);
    return result;
  }, [items, search, categoryFilter, stockFilter]);

  const lowStockItems = useMemo(() => items.filter((i) => getStockLevel(i) === 'low'), [items]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const openAdd = () => {
    setEditItem(null);
    setFormName('');
    setFormSku('');
    setFormCategory(categories[0]?.name || '');
    setFormStock(0);
    setFormMinStock(0);
    setFormMaxStock(0);
    setFormSupplier('');
    setFormCost(0);
    setFormUnit('units');
    setModalOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setFormName(item.name);
    setFormSku(item.sku);
    setFormCategory(item.category);
    setFormStock(item.stock);
    setFormMinStock(item.minStock);
    setFormMaxStock(item.maxStock);
    setFormSupplier(item.supplier);
    setFormCost(item.costPerUnit);
    setFormUnit(item.unit);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? {
                ...i,
                name: formName.trim(),
                sku: formSku.trim(),
                category: formCategory,
                stock: formStock,
                minStock: formMinStock,
                maxStock: formMaxStock,
                supplier: formSupplier.trim(),
                costPerUnit: formCost,
                unit: formUnit,
                lastRestocked: new Date().toISOString().slice(0, 10),
              }
            : i,
        ),
      );
      showMessage('Item updated');
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        name: formName.trim(),
        sku: formSku.trim(),
        category: formCategory,
        stock: formStock,
        minStock: formMinStock,
        maxStock: formMaxStock,
        supplier: formSupplier.trim(),
        costPerUnit: formCost,
        unit: formUnit,
        lastRestocked: new Date().toISOString().slice(0, 10),
      };
      setItems((prev) => [...prev, newItem]);
      showMessage('Item added');
    }
    setModalOpen(false);
  };

  const handleRestock = () => {
    showMessage('Stock restocked');
  };

  const handleHistory = (item: InventoryItem) => {
    showMessage(`Restock history for ${item.name} — last restocked: ${item.lastRestocked}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Item Name',
      render: (item: InventoryItem) => <span className="font-medium text-slate-800 dark:text-white">{item.name}</span>,
    },
    {
      key: 'sku',
      header: 'SKU',
      className: 'hidden sm:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-500 dark:text-slate-400 text-xs">{item.sku}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      className: 'hidden sm:table-cell',
      render: (item: InventoryItem) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {item.category}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Current Stock',
      render: (item: InventoryItem) => {
        const level = getStockLevel(item);
        const color = level === 'low' ? 'text-red-600 dark:text-red-400' : level === 'adequate' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${level === 'low' ? 'bg-red-500' : level === 'adequate' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min((item.stock / item.maxStock) * 100, 100)}%` }}
              />
            </div>
            <span className={`font-semibold text-sm ${color}`}>{item.stock}</span>
          </div>
        );
      },
    },
    {
      key: 'minStock',
      header: 'Min Stock',
      className: 'hidden md:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-500 dark:text-slate-400">{item.minStock}</span>,
    },
    {
      key: 'maxStock',
      header: 'Max Stock',
      className: 'hidden md:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-500 dark:text-slate-400">{item.maxStock}</span>,
    },
    {
      key: 'supplier',
      header: 'Supplier',
      className: 'hidden lg:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-600 dark:text-slate-300 text-xs">{item.supplier}</span>,
    },
    {
      key: 'costPerUnit',
      header: 'Cost',
      className: 'hidden md:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-600 dark:text-slate-300">Rs. {item.costPerUnit.toFixed(2)}</span>,
    },
    {
      key: 'lastRestocked',
      header: 'Last Restocked',
      className: 'hidden lg:table-cell',
      render: (item: InventoryItem) => <span className="text-slate-500 dark:text-slate-400 text-xs">{item.lastRestocked}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: InventoryItem) => <StatusBadge status={stockLabel[getStockLevel(item)]} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(item)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleRestock}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleHistory(item)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const categoryOptions = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Track stock levels and manage supplies</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Inventory Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {lowStockItems.length} low stock item{lowStockItems.length > 1 ? 's' : ''} — order immediately
            </p>
            <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">
              {lowStockItems.map((i) => `${i.name} (${i.stock}/${i.minStock})`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-slideUp">
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockLevel | '')}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low</option>
          <option value="adequate">Adequate</option>
          <option value="good">Good</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item: InventoryItem) => item.id}
          pageSize={20}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Inventory Item' : 'Add Inventory Item'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
            <input
              type="text"
              value={formSku}
              onChange={(e) => setFormSku(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
            <input
              type="text"
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Stock</label>
            <input
              type="number"
              min={0}
              value={formStock}
              onChange={(e) => setFormStock(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Stock</label>
            <input
              type="number"
              min={0}
              value={formMinStock}
              onChange={(e) => setFormMinStock(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Stock</label>
            <input
              type="number"
              min={0}
              value={formMaxStock}
              onChange={(e) => setFormMaxStock(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
            <input
              type="text"
              value={formSupplier}
              onChange={(e) => setFormSupplier(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost per Unit (Rs.)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={formCost}
              onChange={(e) => setFormCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
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
            {editItem ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
