import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Sun, Sunset, Moon } from 'lucide-react';
import { employees as initialEmployees } from '../../data/employees';
import type { Employee } from '../../types';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import DataTable from './DataTable';
import type { Column } from './DataTable';

const shiftIcon: Record<string, React.ReactNode> = {
  morning: <Sun className="w-3.5 h-3.5 text-amber-500" />,
  afternoon: <Sunset className="w-3.5 h-3.5 text-orange-500" />,
  evening: <Moon className="w-3.5 h-3.5 text-indigo-500" />,
};

const shiftLabel: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

const roleOptions = ['Cashier', 'Cook', 'Manager', 'Delivery Driver', 'Host', 'Cleaner', 'Kitchen Staff'];
const shiftOptions = ['morning', 'afternoon', 'evening'];
const statusOptions = ['active', 'inactive', 'on-leave'];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Employee | null>(null);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState(roleOptions[0]);
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formShift, setFormShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'on-leave'>('active');

  const filtered = useMemo(() => {
    let result = employees;
    const q = search.toLowerCase();
    if (q) result = result.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
    if (shiftFilter) result = result.filter((e) => e.shift === shiftFilter);
    if (statusFilter) result = result.filter((e) => e.status === statusFilter);
    return result;
  }, [employees, search, shiftFilter, statusFilter]);

  const openAdd = () => {
    setEditItem(null);
    setFormName('');
    setFormRole(roleOptions[0]);
    setFormPhone('');
    setFormEmail('');
    setFormShift('morning');
    setFormStatus('active');
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditItem(emp);
    setFormName(emp.name);
    setFormRole(emp.role);
    setFormPhone(emp.phone);
    setFormEmail(emp.email);
    setFormShift(emp.shift);
    setFormStatus(emp.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editItem) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editItem.id
            ? { ...e, name: formName.trim(), role: formRole, phone: formPhone.trim(), email: formEmail.trim(), shift: formShift, status: formStatus }
            : e,
        ),
      );
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: formName.trim(),
        role: formRole,
        phone: formPhone.trim(),
        email: formEmail.trim(),
        shift: formShift,
        status: formStatus,
        startDate: new Date().toISOString().slice(0, 10),
      };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Name',
      render: (emp: Employee) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold">
            {emp.name.charAt(0)}
          </div>
          <span className="font-medium text-slate-800 dark:text-white">{emp.name}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (emp: Employee) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {emp.role}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'hidden sm:table-cell',
      render: (emp: Employee) => <span className="text-slate-600 dark:text-slate-300 text-sm">{emp.phone}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      className: 'hidden md:table-cell',
      render: (emp: Employee) => <span className="text-slate-500 dark:text-slate-400 text-xs">{emp.email}</span>,
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (emp: Employee) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {shiftIcon[emp.shift]}
          {shiftLabel[emp.shift]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (emp: Employee) => <StatusBadge status={emp.status} size="sm" />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      className: 'hidden sm:table-cell',
      render: (emp: Employee) => <span className="text-slate-500 dark:text-slate-400 text-xs">{emp.startDate}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (emp: Employee) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(emp)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(emp.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff and schedules</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
          />
        </div>
        <select
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        >
          <option value="">All Shifts</option>
          {shiftOptions.map((s) => (
            <option key={s} value={s}>{shiftLabel[s]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(emp: Employee) => emp.id}
          pageSize={20}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Employee' : 'Add Employee'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shift</label>
              <div className="flex gap-2">
                {shiftOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormShift(s as 'morning' | 'afternoon' | 'evening')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formShift === s
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {shiftIcon[s]}
                    {shiftLabel[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive' | 'on-leave')}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editItem ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
