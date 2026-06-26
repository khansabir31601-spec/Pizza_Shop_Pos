import type { CartItem as CartItemType } from '../types';
import CartItemComponent from './CartItem';
import OrderSummary from './OrderSummary';
import { ShoppingBag } from 'lucide-react';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onCompleteOrder: () => void;
  onHoldOrder: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemove, onClearCart, onCompleteOrder, onHoldOrder }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = parseFloat((subtotal * 0.1).toFixed(2));
  const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2));
  const grandTotal = parseFloat((subtotal - discount + tax).toFixed(2));

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <OrderSummary subtotal={0} discount={0} tax={0} grandTotal={0} />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6">
          <ShoppingBag className="w-14 h-14 mb-3 opacity-30" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Cart is empty</p>
          <p className="text-xs mt-0.5">Add items from the menu</p>
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            disabled
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-xl text-sm font-bold cursor-not-allowed transition-all"
          >
            Complete Order
          </button>
          <button
            disabled
            className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl text-sm font-medium cursor-not-allowed"
          >
            Hold Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <OrderSummary subtotal={subtotal} discount={discount} tax={tax} grandTotal={grandTotal} />
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {items.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2 bg-white dark:bg-slate-800">
        <button
          onClick={onCompleteOrder}
          className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl text-sm font-bold transition-all duration-150 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
        >
          Complete Order
        </button>
        <div className="flex gap-2">
          <button
            onClick={onHoldOrder}
            className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Hold Order
          </button>
          <button
            onClick={onClearCart}
            className="flex-1 py-2 px-4 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
