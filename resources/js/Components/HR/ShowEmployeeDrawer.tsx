import Drawer from '@/Components/Drawer';
import { Pencil } from 'lucide-react';
import type { EmployeeDrawerEmployee } from './EmployeeDrawerTypes';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: EmployeeDrawerEmployee | null;
    onEdit: (employee: EmployeeDrawerEmployee) => void;
}

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-[13px] font-medium text-slate-900">{value ?? '—'}</p>
        </div>
    );
}

export default function ShowEmployeeDrawer({ isOpen, onClose, employee, onEdit }: Props) {
    if (!employee) return null;

    const formatDate = (d: string) => {
        if (!d) return '—';
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={employee.user.name}
            description={employee.employee_id}
            maxWidth="max-w-[90vw]"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 text-[13px] font-semibold hover:text-slate-800 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(employee)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </button>
                </div>
            }
        >
            <div className="space-y-10">
                {/* Account Details */}
                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Field label="Employee ID" value={employee.employee_id} />
                        <Field label="Employee Name" value={employee.user.name} />
                        <Field label="Email" value={employee.user.email} />
                        <Field label="Mobile" value={employee.user.phone} />
                        <Field label="Designation" value={employee.designation?.title} />
                        <Field label="Department" value={employee.department?.name} />
                        <Field label="User Role" value={employee.user.role} />
                        <Field label="Shift" value={employee.shift?.name} />
                        <Field label="Joining Date" value={formatDate(employee.joining_date)} />
                    </div>
                </div>

                {/* Other Details */}
                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Other Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Field label="Status" value={employee.status} />
                        <Field label="Employment Type" value={employee.employment_type} />
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
