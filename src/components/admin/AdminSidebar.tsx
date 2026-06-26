import { Pizza, LayoutDashboard, ShoppingCart, ClipboardList, Package, Tags, Warehouse, Users, Briefcase, BarChart3, Percent, Gift, Ticket, DollarSign, Truck, UtensilsCrossed, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { page: 'pos', icon: ShoppingCart, label: 'POS' },
      { page: 'orders', icon: ClipboardList, label: 'Orders' },
      { page: 'products', icon: Package, label: 'Products' },
      { page: 'categories', icon: Tags, label: 'Categories' },
    ],
  },
  {
    label: 'Management',
    items: [
      { page: 'inventory', icon: Warehouse, label: 'Inventory' },
      { page: 'customers', icon: Users, label: 'Customers' },
      { page: 'employees', icon: Briefcase, label: 'Employees' },
      { page: 'reports', icon: BarChart3, label: 'Reports' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { page: 'discounts', icon: Percent, label: 'Discounts' },
      { page: 'deals', icon: Gift, label: 'Deals' },
      { page: 'coupons', icon: Ticket, label: 'Coupons' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { page: 'expenses', icon: DollarSign, label: 'Expenses' },
      { page: 'suppliers', icon: Truck, label: 'Suppliers' },
    ],
  },
  {
    label: 'Other',
    items: [
      { page: 'kitchen', icon: UtensilsCrossed, label: 'Kitchen' },
      { page: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminSidebar({ activePage, onNavigate, collapsed, onToggle }: AdminSidebarProps) {
  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen flex-shrink-0 bg-slate-900 text-slate-400 transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? 'w-16' : 'w-60'}
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
              <Pizza className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-white whitespace-nowrap">PizzaHub</span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden ml-auto p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5
                      ${isActive
                        ? 'bg-orange-500/20 text-orange-500 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }
                      ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-2">
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
