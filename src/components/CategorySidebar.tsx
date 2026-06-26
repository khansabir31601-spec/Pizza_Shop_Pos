import { categories } from '../data/products';
import { Pizza, Beef, Soup, Drumstick, Wine, Cake, Salad, Puzzle, Tag } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-4.5 h-4.5" />,
  Burgers: <Beef className="w-4.5 h-4.5" />,
  Fries: <Soup className="w-4.5 h-4.5" />,
  Chicken: <Drumstick className="w-4.5 h-4.5" />,
  Drinks: <Wine className="w-4.5 h-4.5" />,
  Desserts: <Cake className="w-4.5 h-4.5" />,
  Salads: <Salad className="w-4.5 h-4.5" />,
  Extras: <Puzzle className="w-4.5 h-4.5" />,
  Deals: <Tag className="w-4.5 h-4.5" />,
};

interface CategorySidebarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySidebar({ selected, onSelect }: CategorySidebarProps) {
  return (
    <aside className="w-[68px] lg:w-52 bg-slate-900 text-slate-100 flex-shrink-0 overflow-y-auto scrollbar-thin">
      <div className="p-2 lg:p-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 hidden lg:block px-2.5">
          Categories
        </h3>
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => onSelect('All')}
            className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 lg:py-2 rounded-lg text-xs lg:text-sm transition-all duration-150 ${
              selected === 'All'
                ? 'bg-orange-500/20 text-orange-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Pizza className="w-4 h-4 flex-shrink-0" />
            <span className="hidden lg:inline">All Items</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 lg:py-2 rounded-lg text-xs lg:text-sm transition-all duration-150 ${
                selected === category
                  ? 'bg-orange-500/20 text-orange-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="flex-shrink-0">{categoryIcons[category]}</span>
              <span className="hidden lg:inline">{category}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
