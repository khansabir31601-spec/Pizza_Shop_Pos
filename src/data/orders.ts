import type { Order } from '../types';

const customers = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
  'James Wilson', 'Walk-in Customer', 'Jessica Taylor', 'David Anderson',
  'Maria Garcia', 'Robert Lee',
];
const methods = ['Cash', 'Card', 'QR Payment'] as const;
const statuses = ['completed', 'completed', 'completed', 'pending', 'refunded', 'completed'] as const;
const items = [
  [{ id: 'pizza-1', name: 'Margherita Pizza', price: 12.99, quantity: 1, image: '', description: '', category: 'Pizza', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'pizza-2', name: 'Pepperoni Pizza', price: 14.99, quantity: 2, image: '', description: '', category: 'Pizza', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'burger-1', name: 'Classic Cheeseburger', price: 9.99, quantity: 1, image: '', description: '', category: 'Burgers', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'fries-1', name: 'Classic Fries', price: 4.99, quantity: 1, image: '', description: '', category: 'Fries', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'drinks-1', name: 'Coca-Cola', price: 2.49, quantity: 2, image: '', description: '', category: 'Drinks', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'chicken-1', name: 'Fried Chicken (6pc)', price: 11.99, quantity: 1, image: '', description: '', category: 'Chicken', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'drinks-2', name: 'Lemonade', price: 3.49, quantity: 1, image: '', description: '', category: 'Drinks', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'pizza-3', name: 'BBQ Chicken Pizza', price: 16.99, quantity: 1, image: '', description: '', category: 'Pizza', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'extras-1', name: 'Garlic Bread', price: 3.99, quantity: 2, image: '', description: '', category: 'Extras', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'dessert-1', name: 'Chocolate Brownie', price: 5.99, quantity: 3, image: '', description: '', category: 'Desserts', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'burger-2', name: 'Bacon BBQ Burger', price: 12.99, quantity: 2, image: '', description: '', category: 'Burgers', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'fries-2', name: 'Loaded Fries', price: 7.99, quantity: 1, image: '', description: '', category: 'Fries', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
  [{ id: 'chicken-2', name: 'Chicken Wings (12pc)', price: 13.99, quantity: 1, image: '', description: '', category: 'Chicken', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }, { id: 'drinks-3', name: 'Iced Tea', price: 2.99, quantity: 1, image: '', description: '', category: 'Drinks', cost: 0, sku: '', stock: 0, status: 'active' as const, lastUpdated: '' }],
];

export function generateOrders(count = 30): Order[] {
  const now = new Date();
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getTime() - (i * 60 + Math.floor(Math.random() * 30)) * 60000 - Math.random() * 86400000 * 5);
    const orderItems = items[i % items.length];
    const subtotal = parseFloat(orderItems.reduce((s, it) => s + it.price * it.quantity, 0).toFixed(2));
    const discount = parseFloat((subtotal * 0.1).toFixed(2));
    const tax = parseFloat(((subtotal - discount) * 0.08).toFixed(2));
    const grandTotal = parseFloat((subtotal - discount + tax).toFixed(2));
    const method = methods[Math.floor(Math.random() * methods.length)];
    const amountReceived = method === 'Cash' ? Math.ceil(grandTotal / 5) * 5 : grandTotal;
    orders.push({
      id: `ord-${1000 + i}`,
      invoiceNumber: `INV-${String(1000 + i).padStart(4, '0')}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      items: orderItems as any[],
      subtotal, discount, tax, grandTotal,
      paymentMethod: method,
      amountReceived,
      change: parseFloat((amountReceived - grandTotal).toFixed(2)),
      date: date.toISOString(),
      cashier: ['Alex Rivera', 'Sarah Johnson', 'Michael Chen'][Math.floor(Math.random() * 3)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return orders;
}

export const recentOrders = generateOrders(30);
