import { useState } from 'react';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import OrdersPage from './admin/OrdersPage';
import ProductsPage from './admin/ProductsPage';
import CategoriesPage from './admin/CategoriesPage';
import InventoryPage from './admin/InventoryPage';
import CustomersPage from './admin/CustomersPage';
import EmployeesPage from './admin/EmployeesPage';
import ReportsPage from './admin/ReportsPage';
import DealsPage from './admin/DealsPage';
import CouponsPage from './admin/CouponsPage';
import ExpensesPage from './admin/ExpensesPage';
import SuppliersPage from './admin/SuppliersPage';
import KitchenPage from './admin/KitchenPage';
import SettingsPage from './admin/SettingsPage';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  pos: 'POS',
  orders: 'Orders',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  customers: 'Customers',
  employees: 'Employees',
  reports: 'Reports',
  discounts: 'Discounts',
  deals: 'Deals',
  coupons: 'Coupons',
  expenses: 'Expenses',
  suppliers: 'Suppliers',
  kitchen: 'Kitchen Display',
  settings: 'Settings',
};

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardHome />;
      case 'orders': return <OrdersPage />;
      case 'products': return <ProductsPage />;
      case 'categories': return <CategoriesPage />;
      case 'inventory': return <InventoryPage />;
      case 'customers': return <CustomersPage />;
      case 'employees': return <EmployeesPage />;
      case 'reports': return <ReportsPage />;
      case 'deals': return <DealsPage />;
      case 'coupons': return <CouponsPage />;
      case 'expenses': return <ExpensesPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'kitchen': return <KitchenPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardHome />;
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={setActivePage}
      pageTitle={pageTitles[activePage] || 'Dashboard'}
    >
      {renderPage()}
    </AdminLayout>
  );
}
