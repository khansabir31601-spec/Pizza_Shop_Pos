import { useState, useEffect } from 'react';
import { Search, Sun, Moon, LogOut, History, Pizza } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRecentOrders: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ darkMode, onToggleDarkMode, onRecentOrders, searchQuery, onSearchChange }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Pizza className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">PizzaHub</span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">POS</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <span className="text-slate-500">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
            <span className="font-semibold text-slate-800 dark:text-white font-mono tabular-nums">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{user?.name || 'Cashier'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-36 lg:w-48 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={onRecentOrders}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            title="Recent Orders"
          >
            <History className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm"
            title="Logout"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="hidden lg:inline text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
