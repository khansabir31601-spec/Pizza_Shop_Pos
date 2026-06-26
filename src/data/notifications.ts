import type { Notification } from '../types';

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'low-stock',
    message: 'Mozzarella Cheese is below minimum stock level (12 units remaining)',
    date: '2026-06-25T10:30:00',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'new-order',
    message: 'New order #INV-2026-0421 received for delivery',
    date: '2026-06-25T09:15:00',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'inventory-alert',
    message: 'Burger Buns stock critically low - only 5 units left',
    date: '2026-06-24T14:20:00',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'system',
    message: 'POS system update v2.4.0 available for installation',
    date: '2026-06-24T08:00:00',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'low-stock',
    message: 'Cooking Oil is below minimum stock level (4 units remaining)',
    date: '2026-06-23T16:45:00',
    read: false,
  },
  {
    id: 'notif-6',
    type: 'new-order',
    message: 'New order #INV-2026-0420 placed for pickup',
    date: '2026-06-23T12:30:00',
    read: true,
  },
  {
    id: 'notif-7',
    type: 'inventory-alert',
    message: 'Ice Cream stock is running low - 3 units remaining',
    date: '2026-06-22T11:10:00',
    read: true,
  },
  {
    id: 'notif-8',
    type: 'system',
    message: 'Daily backup completed successfully at 2:00 AM',
    date: '2026-06-25T02:00:00',
    read: true,
  },
  {
    id: 'notif-9',
    type: 'low-stock',
    message: 'Tomato Sauce stock is below minimum (8 units remaining)',
    date: '2026-06-21T09:30:00',
    read: true,
  },
  {
    id: 'notif-10',
    type: 'new-order',
    message: 'New order #INV-2026-0419 received for delivery',
    date: '2026-06-25T08:45:00',
    read: false,
  },
];
