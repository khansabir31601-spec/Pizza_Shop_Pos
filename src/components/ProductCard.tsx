import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.popular && product.cost <= product.price && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-md">
            <Star className="w-2.5 h-2.5 fill-current" />
            Popular
          </div>
        )}
        {product.cost > product.price && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow">
            SAVE Rs. {(product.cost - product.price).toFixed(2)}
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded-full backdrop-blur-sm border border-white/10">
          {product.category}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-white truncate">{product.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            {product.cost > product.price && (
              <span className="text-xs text-slate-400 line-through">Rs. {product.cost.toFixed(2)}</span>
            )}
            <span className="text-base font-bold text-orange-600 dark:text-orange-400">Rs. {product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
