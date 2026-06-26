import { useState, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../data/notifications';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  pageTitle?: string;
}

export default function AdminLayout({ children, activePage, onNavigate, pageTitle }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSearch = () => {
    // TODO: implement search
  };

  const handleNotifications = () => {
    // TODO: implement notifications panel
  };

  const handleToggleDark = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <AdminSidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          onSearch={handleSearch}
          onNotifications={handleNotifications}
          darkMode={darkMode}
          onToggleDark={handleToggleDark}
          user={user ? { name: user.name, role: user.role } : null}
          onLogout={logout}
          unreadNotifCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {pageTitle && (
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{pageTitle}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
