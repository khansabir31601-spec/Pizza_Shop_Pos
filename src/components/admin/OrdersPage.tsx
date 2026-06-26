import { useState, useMemo } from 'react';
import type { Order } from '../../types';
import { recentOrders } from '../../data/orders';
import { printOrder } from '../../utils/print';
import StatusBadge from './StatusBadge';
import DataTable from './DataTable';
import {
  Search, Eye, Printer, Undo2, FileDown,
  X, Filter, ChevronDown, SlidersHorizontal,
} from 'lucide-react';

type OrderStatus = 'all' | 'completed' | 'pending' | 'refunded' | 'cancelled';

export default function OrdersPage() {
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const orders = recentOrders as Order[];

  const filtered = useMemo(() => {
    let result = orders;
    if (searchInvoice) {
      const q = searchInvoice.toLowerCase();
      result = result.filter((o) => o.invoiceNumber.toLowerCase().includes(q));
    }
    if (searchCustomer) {
      const q = searchCustomer.toLowerCase();
      result = result.filter((o) => o.customerName.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (paymentFilter !== 'all') {
      result = result.filter((o) => o.paymentMethod === paymentFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((o) => new Date(o.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.date) <= to);
    }
    return result;
  }, [orders, searchInvoice, searchCustomer, statusFilter, paymentFilter, dateFrom, dateTo]);

  const columns = [
    {
      key: 'invoiceNumber', header: 'Invoice#', className: 'font-medium text-slate-800 dark:text-white',
    },
    {
      key: 'customerName', header: 'Customer', className: 'text-slate-600 dark:text-slate-300',
    },
    {
      key: 'cashier', header: 'Cashier', className: 'text-slate-500 dark:text-slate-400 hidden md:table-cell',
    },
    {
      key: 'date', header: 'Date', className: 'hidden sm:table-cell',
      render: (o: Order) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'items', header: 'Items', className: 'text-center hidden lg:table-cell',
      render: (o: Order) => (
        <span className="text-slate-600 dark:text-slate-400">{o.items.reduce((s, i) => s + i.quantity, 0)}</span>
      ),
    },
    {
      key: 'paymentMethod', header: 'Payment', className: 'hidden sm:table-cell',
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
      key: 'grandTotal', header: 'Total', className: 'font-semibold text-slate-800 dark:text-white',
      render: (o: Order) => `$${o.grandTotal.toFixed(2)}`,
    },
    {
      key: 'actions', header: 'Actions', className: 'text-right',
      render: (o: Order) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setViewOrder(o); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); printOrder(o); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
            title="Refund"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400'
                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <FileDown className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customer..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Payments</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="QR Payment">QR Payment</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(o: Order) => o.id}
          pageSize={20}
        />
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setViewOrder(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Order Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{viewOrder.invoiceNumber}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer</p>
                  <p className="text-slate-800 dark:text-white font-medium">{viewOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cashier</p>
                  <p className="text-slate-800 dark:text-white">{viewOrder.cashier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Date</p>
                  <p className="text-slate-800 dark:text-white">
                    {new Date(viewOrder.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status</p>
                  <StatusBadge status={viewOrder.status} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Items</h4>
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-slate-600">
                        <th className="p-2 font-medium">Item</th>
                        <th className="p-2 font-medium text-center">Qty</th>
                        <th className="p-2 font-medium text-right">Price</th>
                        <th className="p-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewOrder.items.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                          <td className="p-2 text-slate-800 dark:text-white">{item.name}</td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                          <td className="p-2 text-right text-slate-600 dark:text-slate-400">${item.price.toFixed(2)}</td>
                          <td className="p-2 text-right font-medium text-slate-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>${viewOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-${viewOrder.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax (8%)</span>
                  <span>${viewOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-white text-base pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span>${viewOrder.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Payment Method</span>
                  <span className="font-medium text-slate-800 dark:text-white">{viewOrder.paymentMethod}</span>
                </div>
                {viewOrder.paymentMethod === 'Cash' && (
                  <>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mt-1">
                      <span>Amount Received</span>
                      <span className="font-medium text-slate-800 dark:text-white">${viewOrder.amountReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mt-1">
                      <span>Change</span>
                      <span className="font-medium text-slate-800 dark:text-white">${viewOrder.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button
                onClick={() => setViewOrder(null)}
                className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { printOrder(viewOrder); }}
                className="flex items-center justify-center gap-1.5 flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
