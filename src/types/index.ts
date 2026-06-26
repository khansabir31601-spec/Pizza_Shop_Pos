export type UserRole = 'cashier' | 'admin' | 'manager';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  image: string;
  popular?: boolean;
  sku: string;
  stock: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  date: string;
  cashier: string;
  status: 'completed' | 'pending' | 'refunded' | 'cancelled';
}

export type PaymentMethod = 'Cash' | 'Card' | 'QR Payment';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
  unit: string;
}

export interface DashboardStats {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  expenses: number;
  profit: number;
  activeProducts: number;
  lowStockItems: number;
  customersToday: number;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  image: string;
  products: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpending: number;
  lastVisit: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  shift: 'morning' | 'afternoon' | 'evening';
  status: 'active' | 'inactive' | 'on-leave';
  startDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiry: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface Supplier {
  id: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsSupplied: string[];
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  status: 'active' | 'inactive';
}

export interface Notification {
  id: string;
  type: 'low-stock' | 'new-order' | 'inventory-alert' | 'system';
  message: string;
  date: string;
  read: boolean;
}

export interface SalesData {
  date: string;
  amount: number;
  orders: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  category?: string;
  type?: 'daily' | 'weekly' | 'monthly';
}
