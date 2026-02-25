import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import type { DataTableColumn } from '@/Components/DataTable';
import CreateEmployeeDrawer from '@/Components/HR/CreateEmployeeDrawer';
import ShowEmployeeDrawer from '@/Components/HR/ShowEmployeeDrawer';
import EditEmployeeDrawer from '@/Components/HR/EditEmployeeDrawer';
import InviteEmployeeDrawer from '@/Components/HR/InviteEmployeeDrawer';
import type { EmployeeDrawerEmployee } from '@/Components/HR/EmployeeDrawerTypes';
import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Filter,
    Mail,
    Phone,
    Download,
    Eye,
    Pencil,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface Props {
    employees: EmployeeDrawerEmployee[];
    departments: { id: number; name: string }[];
    designations: { id: number; title: string; department_id: number }[];
    shifts: { id: number; name: string }[];
}

export default function Index({ employees, departments, designations, shifts }: Props) {
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false);
    const [viewDrawerEmployee, setViewDrawerEmployee] = useState<EmployeeDrawerEmployee | null>(null);
    const [editDrawerEmployee, setEditDrawerEmployee] = useState<EmployeeDrawerEmployee | null>(null);

    const columns: DataTableColumn<EmployeeDrawerEmployee>[] = useMemo(
        () => [
            {
                id: 'employee',
                header: 'Employee',
                cell: (emp) => (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm shrink-0 border border-slate-200">
                            {emp.user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 text-[13px]">{emp.user.name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{emp.employee_id}</p>
                        </div>
                    </div>
                ),
            },
            {
                id: 'organization',
                header: 'Organization',
                cell: (emp) => (
                    <div>
                        <p className="text-[12px] font-medium text-slate-700">{emp.department?.name ?? '—'}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tight">{emp.designation?.title ?? '—'}</p>
                    </div>
                ),
            },
            {
                id: 'core_info',
                header: 'Core Info',
                cell: (emp) => (
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-900">
                            <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                            <span className="truncate max-w-[200px]">{emp.user.email}</span>
                        </div>
                        {emp.user.phone ? (
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                                {emp.user.phone}
                            </div>
                        ) : null}
                    </div>
                ),
            },
            {
                id: 'lifecycle',
                header: 'Lifecycle',
                cell: (emp) => (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', emp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500')} />
                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{emp.status}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-medium uppercase tracking-tighter">
                            {emp.employment_type}
                        </span>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{employees.length} Personnel Total</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all">
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsInviteDrawerOpen(true)}
                            className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 text-[12px] font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Invite
                        </button>
                        <button
                            onClick={() => setIsAddDrawerOpen(true)}
                            className="bg-slate-900 text-white h-10 px-5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <Plus className="w-3.5 h-3.5" /> Onboard Talent
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Employee Directory" />

            <div className="max-w-[1600px] mx-auto space-y-4">
                {/* Toolbar: Filter only (per module-ui-patterns) */}
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{employees.length} personnel</span>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                </div>

                <DataTable<EmployeeDrawerEmployee>
                    columns={columns}
                    data={employees}
                    getRowId={(row) => row.id}
                    emptyMessage="No employees found. Use “Onboard Talent” to add your first employee."
                    renderActions={(emp) => (
                        <div className="flex items-center justify-end gap-0.5">
                            <button
                                type="button"
                                className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                title="View"
                                onClick={() => setViewDrawerEmployee(emp)}
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditDrawerEmployee(emp)}
                                className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                title="Edit"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this employee?')) {
                                        router.delete(route('hr.employees.destroy', emp.id));
                                    }
                                }}
                                className="p-1.5 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                />
            </div>

            <CreateEmployeeDrawer
                isOpen={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                departments={departments}
                designations={designations}
                shifts={shifts}
            />
            <InviteEmployeeDrawer
                isOpen={isInviteDrawerOpen}
                onClose={() => setIsInviteDrawerOpen(false)}
            />
            <ShowEmployeeDrawer
                isOpen={!!viewDrawerEmployee}
                onClose={() => setViewDrawerEmployee(null)}
                employee={viewDrawerEmployee}
                onEdit={(emp) => {
                    setViewDrawerEmployee(null);
                    setEditDrawerEmployee(emp);
                }}
            />
            <EditEmployeeDrawer
                isOpen={!!editDrawerEmployee}
                onClose={() => setEditDrawerEmployee(null)}
                employee={editDrawerEmployee}
                departments={departments}
                designations={designations}
                shifts={shifts}
            />
        </AuthenticatedLayout>
    );
}
