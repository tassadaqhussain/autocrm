import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Save, User, Mail, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import type { EmployeeDrawerEmployee } from './EmployeeDrawerTypes';

interface Dept {
    id: number;
    name: string;
}
interface Desig {
    id: number;
    title: string;
    department_id: number;
}
interface Shift {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: EmployeeDrawerEmployee | null;
    departments: Dept[];
    designations: Desig[];
    shifts: Shift[];
}

const ROLES = ['', 'Employee', 'Admin', 'Doctor', 'Counselor', 'Staff', 'Media Manager'];
const EMPLOYMENT_TYPES = ['', 'Full-time', 'Part-time', 'Contract'];

function employeeToForm(emp: EmployeeDrawerEmployee) {
    return {
        name: emp.user.name,
        email: emp.user.email,
        password: '',
        role: emp.user.role,
        department_id: String(emp.department?.id ?? ''),
        designation_id: String(emp.designation?.id ?? ''),
        shift_id: String(emp.shift?.id ?? ''),
        employment_type: emp.employment_type || 'Full-time',
        joining_date: emp.joining_date ? emp.joining_date.split('T')[0] : '',
        phone: emp.user.phone ?? '',
    };
}

export default function EditEmployeeDrawer({
    isOpen,
    onClose,
    employee,
    departments: initialDepts,
    designations: initialDesigs,
    shifts,
}: Props) {
    const [depts, setDepts] = useState<Dept[]>(initialDepts);
    const [desigs, setDesigs] = useState<Desig[]>(initialDesigs);
    const [isAddingDept, setIsAddingDept] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [isAddingDesig, setIsAddingDesig] = useState(false);
    const [newDesigTitle, setNewDesigTitle] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setDepts(initialDepts);
        setDesigs(initialDesigs);
    }, [initialDepts, initialDesigs]);

    const initial = employee ? employeeToForm(employee) : {
        name: '', email: '', password: '', role: '', department_id: '', designation_id: '', shift_id: '', employment_type: 'Full-time', joining_date: '', phone: '',
    };
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm(initial);

    useEffect(() => {
        if (employee) {
            const form = employeeToForm(employee);
            (Object.keys(form) as (keyof typeof form)[]).forEach((key) => setData(key, form[key]));
        }
    }, [employee?.id]);

    useEffect(() => {
        if (recentlySuccessful) {
            onClose();
        }
    }, [recentlySuccessful]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employee) return;
        put(route('hr.employees.update', employee.id), {
            preserveScroll: true,
        });
    };

    const handleQuickAddDept = async () => {
        if (!newDeptName.trim()) return;
        try {
            const res = await axios.post(route('hr.departments.quick-store'), { name: newDeptName.trim() });
            setDepts((prev) => [...prev, res.data]);
            setData('department_id', String(res.data.id));
            setNewDeptName('');
            setIsAddingDept(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuickAddDesig = async () => {
        if (!newDesigTitle.trim() || !data.department_id) return;
        try {
            const res = await axios.post(route('hr.designations.quick-store'), {
                title: newDesigTitle.trim(),
                department_id: data.department_id,
            });
            setDesigs((prev) => [...prev, res.data]);
            setData('designation_id', String(res.data.id));
            setNewDesigTitle('');
            setIsAddingDesig(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (!employee) return null;

    return (
        <Drawer
            key={employee.id}
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Employee"
            description={employee.user.name}
            maxWidth="max-w-[90vw]"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 text-[13px] font-semibold hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" /> Update
                    </button>
                </div>
            }
        >
            <form onSubmit={handleUpdate} className="space-y-10">
                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600 flex items-center gap-1">Employee ID</InputLabel>
                            <input type="text" readOnly value={employee.employee_id} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-500" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                            <InputLabel className="text-[13px] text-slate-600">Employee Name <span className="text-rose-500">*</span></InputLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Employee Email <span className="text-rose-500">*</span></InputLabel>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <InputLabel className="text-[13px] text-slate-600">Password</InputLabel>
                            <p className="text-[11px] text-slate-500">Leave blank to keep unchanged.</p>
                            <div className="relative flex-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-11 pl-3 pr-12 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Designation <span className="text-rose-500">*</span></InputLabel>
                            <div className="flex gap-2">
                                {isAddingDesig ? (
                                    <>
                                        <input
                                            value={newDesigTitle}
                                            onChange={(e) => setNewDesigTitle(e.target.value)}
                                            placeholder="Title"
                                            className="flex-1 h-11 px-3 border border-slate-200 rounded-lg text-[13px]"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddDesig())}
                                        />
                                        <button type="button" onClick={handleQuickAddDesig} className="px-3 bg-indigo-600 text-white rounded-lg text-[13px] font-medium">Add</button>
                                    </>
                                ) : (
                                    <>
                                        <select
                                            value={data.designation_id}
                                            onChange={(e) => setData('designation_id', e.target.value)}
                                            className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="">--</option>
                                            {desigs.filter((d) => String(d.department_id) === data.department_id).map((d) => (
                                                <option key={d.id} value={d.id}>{d.title}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => setIsAddingDesig(true)} className="px-3 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">Add</button>
                                    </>
                                )}
                            </div>
                            <InputError message={errors.designation_id} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Department <span className="text-rose-500">*</span></InputLabel>
                            <div className="flex gap-2">
                                {isAddingDept ? (
                                    <>
                                        <input
                                            value={newDeptName}
                                            onChange={(e) => setNewDeptName(e.target.value)}
                                            placeholder="Department name"
                                            className="flex-1 h-11 px-3 border border-slate-200 rounded-lg text-[13px]"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddDept())}
                                        />
                                        <button type="button" onClick={handleQuickAddDept} className="px-3 bg-indigo-600 text-white rounded-lg text-[13px] font-medium">Add</button>
                                    </>
                                ) : (
                                    <>
                                        <select
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="">--</option>
                                            {depts.map((d) => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => setIsAddingDept(true)} className="px-3 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">Add</button>
                                    </>
                                )}
                            </div>
                            <InputError message={errors.department_id} />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Mobile</InputLabel>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g. 1234567890"
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">User Role</InputLabel>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {ROLES.map((r) => (
                                    <option key={r || 'x'} value={r}>{r || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Joining Date</InputLabel>
                            <input
                                type="date"
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900">Other Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Employment Type</InputLabel>
                            <select
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                {EMPLOYMENT_TYPES.map((t) => (
                                    <option key={t || 'x'} value={t}>{t || '--'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <InputLabel className="text-[13px] text-slate-600">Shift</InputLabel>
                            <select
                                value={data.shift_id}
                                onChange={(e) => setData('shift_id', e.target.value)}
                                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">--</option>
                                {shifts.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}
