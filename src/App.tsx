import { useState, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { Product, CartItem, PaymentMethod, Order } from './types';
import { products as allProducts } from './data/products';
import { deals } from './data/deals';
import { recentOrders as mockOrders } from './data/orders';
import { printOrder } from './utils/print';

import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import { ReceiptPreview } from './components/Receipt';
import RecentOrdersModal from './components/RecentOrdersModal';

let invoiceCounter = 5000;

function POSPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>(mockOrders);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const dealProducts = useMemo(() => {
    return deals
      .filter((d) => d.status === 'active')
      .map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        price: d.offerPrice,
        cost: d.originalPrice,
        category: 'Deals',
        image: d.image,
        popular: true,
        sku: d.id.toUpperCase(),
        stock: 999,
        status: 'active' as const,
        lastUpdated: new Date().toISOString().slice(0, 10),
      }));
  }, []);

  const filteredProducts = useMemo(() => {
    const showAll = selectedCategory === 'All';
    const showDeals = selectedCategory === 'Deals';
    const products = showAll || showDeals ? dealProducts : [];
    return allProducts.filter((p) => {
      const matchCategory = showAll || p.category === selectedCategory;
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).concat(products);
  }, [selectedCategory, searchQuery, dealProducts]);

  const handleAddDealProducts = useCallback((productIds: string[]) => {
    for (const id of productIds) {
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prev, { ...product, quantity: 1 }];
        });
      }
    }
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    if (product.id.startsWith('deal-')) {
      const deal = deals.find((d) => d.id === product.id);
      if (deal) {
        handleAddDealProducts(deal.products);
        return;
      }
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [handleAddDealProducts]);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearCart = useCallback(() => setCartItems([]), []);
  const handleCompleteOrder = useCallback(() => setShowPayment(true), []);
  const handleHoldOrder = useCallback(() => {}, []);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = parseFloat((cartSubtotal * 0.1).toFixed(2));
  const cartTax = parseFloat(((cartSubtotal - cartDiscount) * 0.08).toFixed(2));
  const cartGrandTotal = parseFloat((cartSubtotal - cartDiscount + cartTax).toFixed(2));

  const handlePaymentConfirm = useCallback((method: PaymentMethod, amountReceived: number) => {
    const order: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: `INV-${String(++invoiceCounter).padStart(4, '0')}`,
      customerName: 'Walk-in Customer',
      items: [...cartItems],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      grandTotal: cartGrandTotal,
      paymentMethod: method,
      amountReceived,
      change: parseFloat((amountReceived - cartGrandTotal).toFixed(2)),
      date: new Date().toISOString(),
      cashier: user?.name || 'Cashier',
      status: 'completed',
    };

    setRecentOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setShowPayment(false);
    setTimeout(() => printOrder(order), 400);
  }, [cartItems, cartSubtotal, cartDiscount, cartTax, cartGrandTotal, user]);

  const handlePaymentCancel = useCallback(() => setShowPayment(false), []);
  const handleRePrint = useCallback(() => { if (previewOrder) printOrder(previewOrder); }, [previewOrder]);
  const handleViewReceipt = useCallback((order: Order) => { setPreviewOrder(order); setShowReceiptPreview(true); }, []);
  const handlePrintReceipt = useCallback((order: Order) => { printOrder(order); }, []);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onRecentOrders={() => setShowRecentOrders(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
        </main>
        <aside className="w-80 xl:w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col flex-shrink-0 shadow-sm">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onClearCart={handleClearCart}
            onCompleteOrder={handleCompleteOrder}
            onHoldOrder={handleHoldOrder}
          />
        </aside>
      </div>

      {showPayment && <PaymentModal grandTotal={cartGrandTotal} onConfirm={handlePaymentConfirm} onCancel={handlePaymentCancel} />}
      {showRecentOrders && <RecentOrdersModal orders={recentOrders} onClose={() => setShowRecentOrders(false)} onViewReceipt={handleViewReceipt} onPrintReceipt={handlePrintReceipt} />}

      {showReceiptPreview && previewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Receipt Preview</h2>
              <button onClick={() => setShowReceiptPreview(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <ReceiptPreview order={previewOrder} />
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button onClick={() => setShowReceiptPreview(false)} className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Close</button>
              <button onClick={handleRePrint} className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, role, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  if (role === 'cashier') {
    return <POSPage />;
  }

  return <AdminDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
