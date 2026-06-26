import { useState, useEffect } from 'react';
import { X, Package, Bell, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import type { Notification } from '../../types';
import { notifications as initialNotifications } from '../../data/notifications';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const iconMap = {
  'inventory-alert': Package,
  'new-order': Bell,
  'low-stock': AlertTriangle,
  system: Info,
};

const iconColors: Record<string, string> = {
  'inventory-alert': 'text-amber-500 bg-amber-100 dark:bg-amber-900/20',
  'new-order': 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  'low-stock': 'text-red-500 bg-red-100 dark:bg-red-900/20',
  system: 'text-slate-500 bg-slate-100 dark:bg-slate-700',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getGroup(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  if (d >= today) return 'Today';
  if (d >= yesterday) return 'Yesterday';
  return 'Earlier';
}

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const grouped = notifications.reduce<Record<string, Notification[]>>((acc, n) => {
    const group = getGroup(n.date);
    if (!acc[group]) acc[group] = [];
    acc[group].push(n);
    return acc;
  }, {});

  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Bell className="w-10 h-10 mb-2 opacity-50" />
              <p className="font-medium">No notifications</p>
            </div>
          ) : (
            groupOrder.map((group) => {
              if (!grouped[group]) return null;
              return (
                <div key={group}>
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group}
                    </span>
                  </div>
                  {grouped[group].map((n) => {
                    const Icon = iconMap[n.type];
                    return (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${iconColors[n.type]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-white font-medium'}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(n.date)}</p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
