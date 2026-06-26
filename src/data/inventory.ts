import type { InventoryItem } from '../types';

export const inventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Pizza Dough', sku: 'ING-001', category: 'Pizza', stock: 45, minStock: 20, maxStock: 100, supplier: 'Fresh Foods Co.', costPerUnit: 2.50, lastRestocked: '2026-06-24', unit: 'units' },
  { id: 'inv-2', name: 'Mozzarella Cheese', sku: 'ING-002', category: 'Pizza', stock: 12, minStock: 15, maxStock: 50, supplier: 'Dairy Fresh Inc.', costPerUnit: 8.00, lastRestocked: '2026-06-22', unit: 'kg' },
  { id: 'inv-3', name: 'Tomato Sauce', sku: 'ING-003', category: 'Pizza', stock: 8, minStock: 10, maxStock: 40, supplier: 'Fresh Foods Co.', costPerUnit: 3.00, lastRestocked: '2026-06-20', unit: 'liters' },
  { id: 'inv-4', name: 'Pepperoni', sku: 'ING-004', category: 'Pizza', stock: 18, minStock: 10, maxStock: 60, supplier: 'Meat Masters Ltd.', costPerUnit: 12.00, lastRestocked: '2026-06-23', unit: 'kg' },
  { id: 'inv-5', name: 'Chicken Breast', sku: 'ING-005', category: 'Chicken', stock: 22, minStock: 15, maxStock: 50, supplier: 'Meat Masters Ltd.', costPerUnit: 7.50, lastRestocked: '2026-06-25', unit: 'kg' },
  { id: 'inv-6', name: 'Beef Patties', sku: 'ING-006', category: 'Burgers', stock: 60, minStock: 30, maxStock: 120, supplier: 'Meat Masters Ltd.', costPerUnit: 3.00, lastRestocked: '2026-06-24', unit: 'units' },
  { id: 'inv-7', name: 'Burger Buns', sku: 'ING-007', category: 'Burgers', stock: 5, minStock: 30, maxStock: 100, supplier: 'Baker\'s Best', costPerUnit: 0.80, lastRestocked: '2026-06-18', unit: 'units' },
  { id: 'inv-8', name: 'French Fries', sku: 'ING-008', category: 'Fries', stock: 35, minStock: 20, maxStock: 80, supplier: 'Fresh Foods Co.', costPerUnit: 2.00, lastRestocked: '2026-06-23', unit: 'kg' },
  { id: 'inv-9', name: 'Lettuce', sku: 'ING-009', category: 'Salads', stock: 10, minStock: 10, maxStock: 40, supplier: 'Green Valley Farms', costPerUnit: 1.50, lastRestocked: '2026-06-25', unit: 'units' },
  { id: 'inv-10', name: 'Tomatoes', sku: 'ING-010', category: 'Salads', stock: 25, minStock: 15, maxStock: 50, supplier: 'Green Valley Farms', costPerUnit: 0.75, lastRestocked: '2026-06-25', unit: 'units' },
  { id: 'inv-11', name: 'Coca-Cola Syrup', sku: 'ING-011', category: 'Drinks', stock: 6, minStock: 5, maxStock: 20, supplier: 'Beverage Supply Co.', costPerUnit: 15.00, lastRestocked: '2026-06-22', unit: 'liters' },
  { id: 'inv-12', name: 'Ice Cream', sku: 'ING-012', category: 'Desserts', stock: 3, minStock: 10, maxStock: 30, supplier: 'Dairy Fresh Inc.', costPerUnit: 6.00, lastRestocked: '2026-06-19', unit: 'liters' },
  { id: 'inv-13', name: 'Chocolate Brownies', sku: 'ING-013', category: 'Desserts', stock: 20, minStock: 10, maxStock: 50, supplier: 'Baker\'s Best', costPerUnit: 2.50, lastRestocked: '2026-06-24', unit: 'units' },
  { id: 'inv-14', name: 'Onions', sku: 'ING-014', category: 'Extras', stock: 15, minStock: 10, maxStock: 40, supplier: 'Green Valley Farms', costPerUnit: 1.20, lastRestocked: '2026-06-23', unit: 'kg' },
  { id: 'inv-15', name: 'Cooking Oil', sku: 'ING-015', category: 'Extras', stock: 4, minStock: 5, maxStock: 20, supplier: 'Restaurant Supply Co.', costPerUnit: 4.00, lastRestocked: '2026-06-20', unit: 'liters' },
  { id: 'inv-16', name: 'Flour', sku: 'ING-016', category: 'Pizza', stock: 30, minStock: 15, maxStock: 80, supplier: 'Fresh Foods Co.', costPerUnit: 1.50, lastRestocked: '2026-06-24', unit: 'kg' },
  { id: 'inv-17', name: 'Sugar', sku: 'ING-017', category: 'Extras', stock: 20, minStock: 10, maxStock: 50, supplier: 'Restaurant Supply Co.', costPerUnit: 1.20, lastRestocked: '2026-06-22', unit: 'kg' },
];
