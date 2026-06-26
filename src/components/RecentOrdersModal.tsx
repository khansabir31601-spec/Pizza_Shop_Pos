import { useState } from 'react';
import { X, Search, Eye, Printer, Receipt } from 'lucide-react';
import type { Order } from '../types';

interface RecentOrdersModalProps {
  orders: Order[];
  onClose: () => void;
  onViewReceipt: (order: Order) => void;
  onPrintReceipt: (order: Order) => void;
}

export default function RecentOrdersModal({ orders, onClose, onViewReceipt, onPrintReceipt }: RecentOrdersModalProps) {
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchInvoice = o.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchCustomer = o.customerName.toLowerCase().includes(customerSearch.toLowerCase());
    return (!invoiceSearch || matchInvoice) && (!customerSearch || matchCustomer);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Recent Orders</h2>
              <p className="text-[11px] text-slate-500">Last 24 hours</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex gap-2 p-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Invoice..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Customer..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-sm">No orders found</p>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{order.invoiceNumber}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        order.paymentMethod === 'Cash' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        order.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>{order.paymentMethod}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {order.customerName} &middot; {new Date(order.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400 mr-1 tabular-nums">Rs. {order.grandTotal.toFixed(2)}</span>
                    <button onClick={() => onViewReceipt(order)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-orange-500 transition-colors" title="View Receipt">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onPrintReceipt(order)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-orange-500 transition-colors" title="Print Receipt">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
}
