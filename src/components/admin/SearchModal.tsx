import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, SearchX, Package, FileText, Users, Truck } from 'lucide-react';
import { products } from '../../data/products';
import { recentOrders } from '../../data/orders';
import { customers } from '../../data/customers';
import { suppliers } from '../../data/suppliers';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  icon: React.ComponentType<any>;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const productResults: SearchResult[] = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: `SKU: ${p.sku}  |  $${p.price.toFixed(2)}`,
        category: 'Products',
        icon: Package,
      }));

    const orderResults: SearchResult[] = recentOrders
      .filter((o) => o.invoiceNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))
      .map((o) => ({
        id: o.id,
        name: o.invoiceNumber,
        subtitle: `${o.customerName}  |  $${o.grandTotal.toFixed(2)}`,
        category: 'Orders',
        icon: FileText,
      }));

    const customerResults: SearchResult[] = customers
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: c.phone,
        category: 'Customers',
        icon: Users,
      }));

    const supplierResults: SearchResult[] = suppliers
      .filter((s) => s.company.toLowerCase().includes(q))
      .map((s) => ({
        id: s.id,
        name: s.company,
        subtitle: s.contactPerson,
        category: 'Suppliers',
        icon: Truck,
      }));

    return [...productResults, ...orderResults, ...customerResults, ...supplierResults];
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    });
    return map;
  }, [results]);

  const categoryLabels = ['Products', 'Orders', 'Customers', 'Suppliers'];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, orders, customers, suppliers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <SearchX className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          )}

          {query.trim() === '' && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <Search className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">Type to search across the system</p>
            </div>
          )}

          {categoryLabels.map((cat) => {
            if (!grouped[cat]) return null;
            return (
              <div key={cat}>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat}
                  </span>
                </div>
                {grouped[cat].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={`${r.category}-${r.id}`}
                      onClick={onClose}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{r.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{r.subtitle}</p>
                      </div>
                      <span className="ml-auto text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        {r.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
