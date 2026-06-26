import { useState } from 'react';
import {
  Settings, Receipt, Monitor, Palette, Bell,
  Sun, Moon, Save,
} from 'lucide-react';

type Tab = 'general' | 'receipt' | 'pos' | 'theme' | 'notifications';

const tabs: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'receipt', label: 'Receipt', icon: Receipt },
  { key: 'pos', label: 'POS', icon: Monitor },
  { key: 'theme', label: 'Theme', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

const colorPresets = [
  { name: 'Orange', value: '#f97316' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#f97316');

  const showSaveAlert = () => alert('Settings saved');

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Sidebar Tabs */}
      <div className="lg:w-48 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Settings</h1>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.key
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">General Settings</h2>
            <Field label="Shop Name" value="PizzaHub" />
            <Field label="Logo URL" value="https://example.com/logo.png" />
            <Field label="Address" value="123 Pizza Street, Foodville" />
            <Field label="Phone" value="(555) 123-4567" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tax Rate (%)" value="8" />
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Currency</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>$</option>
                  <option>€</option>
                  <option>£</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Time Zone</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>America/Denver</option>
                <option>America/Los_Angeles</option>
              </select>
            </div>
            <SaveButton onClick={showSaveAlert} />
          </div>
        )}

        {activeTab === 'receipt' && (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Receipt Settings</h2>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Receipt Header</label>
              <textarea
                rows={3}
                defaultValue="PizzaHub\n123 Pizza Street\nTel: (555) 123-4567"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Receipt Footer</label>
              <textarea
                rows={3}
                defaultValue="Thank you for your order!\nVisit us again!"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Toggle label="Show Logo" defaultChecked />
            <Toggle label="Auto Print" defaultChecked />
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Paper Size</label>
              <div className="flex gap-3">
                <Radio name="paper" value="58mm" defaultChecked label="58mm" />
                <Radio name="paper" value="80mm" label="80mm" />
              </div>
            </div>
            <SaveButton onClick={showSaveAlert} />
          </div>
        )}

        {activeTab === 'pos' && (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">POS Settings</h2>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Default Payment Method</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Cash</option>
                <option>Card</option>
                <option>QR Payment</option>
              </select>
            </div>
            <Toggle label="Enable Discounts" defaultChecked />
            <Toggle label="Enable Taxes" defaultChecked />
            <Toggle label="Enable Sound" defaultChecked />
            <Toggle label="Enable Barcode" />
            <SaveButton onClick={showSaveAlert} />
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Theme Settings</h2>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Mode</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    !darkMode
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500 mb-2" />
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Light Mode</p>
                  <div className="mt-2 rounded-lg bg-white border border-slate-200 p-2">
                    <div className="h-2 w-12 rounded bg-slate-200 mb-1" />
                    <div className="h-2 w-8 rounded bg-slate-100" />
                  </div>
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    darkMode
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon className="w-6 h-6 text-slate-600 dark:text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Dark Mode</p>
                  <div className="mt-2 rounded-lg bg-slate-800 border border-slate-700 p-2">
                    <div className="h-2 w-12 rounded bg-slate-600 mb-1" />
                    <div className="h-2 w-8 rounded bg-slate-700" />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Primary Color</label>
              <div className="flex gap-3">
                {colorPresets.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-9 h-9 rounded-full transition-all ${
                      selectedColor === c.value ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-slate-800' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <SaveButton onClick={showSaveAlert} />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notification Preferences</h2>
            <Toggle label="Low Stock Alerts" defaultChecked />
            <Toggle label="New Order Alerts" defaultChecked />
            <Toggle label="Inventory Alerts" defaultChecked />
            <Toggle label="System Messages" defaultChecked />
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">Notification settings are read-only in this demo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          on ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function Radio({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="accent-orange-500" />
      {label}
    </label>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
    >
      <Save className="w-4 h-4" />
      Save Settings
    </button>
  );
}
