import { useState, useMemo } from 'react';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { customers as initialCustomers } from '../../data/customers';
import type { Customer } from '../../types';
import Modal from './Modal';
import DataTable from './DataTable';
import type { Column } from './DataTable';

interface OrderSummary {
  id: string;
  date: string;
  items: string;
  total: number;
}

const mockOrders: Record<string, OrderSummary[]> = {
  'cust-1': [
    { id: 'ord-1001', date: '2026-06-25', items: 'Margherita Pizza, Coca-Cola', total: 15.48 },
    { id: 'ord-1002', date: '2026-06-20', items: 'Pepperoni Pizza, Garlic Bread', total: 18.98 },
    { id: 'ord-1003', date: '2026-06-15', items: 'Classic Cheeseburger, Fries', total: 14.98 },
  ],
  'cust-2': [
    { id: 'ord-1004', date: '2026-06-24', items: 'BBQ Chicken Pizza', total: 16.99 },
    { id: 'ord-1005', date: '2026-06-18', items: 'Chicken Wings (12pc), Iced Tea', total: 16.98 },
  ],
};

function getMockOrders(customer: Customer): OrderSummary[] {
  return mockOrders[customer.id] || [
    { id: `ord-${1000 + Math.floor(Math.random() * 9000)}`, date: customer.lastVisit, items: 'Pizza, Drink', total: customer.totalSpending / Math.max(customer.totalOrders, 1) },
  ];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Customer | null>(null);
  const [viewOrders, setViewOrders] = useState<Customer | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const filtered = useMemo(
    () => customers.filter((c) => {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
    }),
    [customers, search],
  );

  const openAdd = () => {
    setEditItem(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditItem(c);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormEmail(c.email);
    setFormAddress(c.address);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editItem) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editItem.id
            ? { ...c, name: formName.trim(), phone: formPhone.trim(), email: formEmail.trim(), address: formAddress.trim() }
            : c,
        ),
      );
    } else {
      const newC: Customer = {
        id: `cust-${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        totalOrders: 0,
        totalSpending: 0,
        lastVisit: new Date().toISOString().slice(0, 10),
      };
      setCustomers((prev) => [...prev, newC]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Name',
      render: (c: Customer) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold">
            {c.name.charAt(0)}
          </div>
          <span className="font-medium text-slate-800 dark:text-white">{c.name}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c: Customer) => <span className="text-slate-600 dark:text-slate-300 text-sm">{c.phone}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      className: 'hidden sm:table-cell',
      render: (c: Customer) => <span className="text-slate-500 dark:text-slate-400 text-xs">{c.email}</span>,
    },
    {
      key: 'totalOrders',
      header: 'Total Orders',
      render: (c: Customer) => <span className="font-semibold text-slate-800 dark:text-white">{c.totalOrders}</span>,
    },
    {
      key: 'totalSpending',
      header: 'Total Spending',
      render: (c: Customer) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          ${c.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      className: 'hidden sm:table-cell',
      render: (c: Customer) => <span className="text-slate-500 dark:text-slate-400 text-xs">{c.lastVisit}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (c: Customer) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewOrders(c)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEdit(c)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(c.id)}
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage customer relationships</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(c: Customer) => c.id}
          pageSize={20}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Customer' : 'Add Customer'}>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
            <textarea
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white resize-none"
            />
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
              {editItem ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewOrders} onClose={() => setViewOrders(null)} title={`Order History — ${viewOrders?.name || ''}`} size="lg">
        {viewOrders && (
          <div className="space-y-3">
            {getMockOrders(viewOrders).length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No orders found for this customer.</p>
            ) : (
              getMockOrders(viewOrders).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{order.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.date}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{order.items}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              ))
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewOrders(null)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
