import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Building2,
    Clock,
    UserCircle,
    Download,
    Check,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import axios from 'axios';

interface Employee {
    id: number;
    employee_id: string;
    user: { id: number; name: string; email: string; role: string; phone: string | null };
    department: { id: number; name: string } | null;
    designation: { id: number; title: string } | null;
    shift: { id: number; name: string; start_time: string; end_time: string } | null;
    status: string;
    employment_type: string;
    joining_date: string;
}

interface Props {
    employees: Employee[];
    departments: { id: number; name: string }[];
    designations: { id: number; title: string; department_id: number }[];
    shifts: { id: number; name: string }[];
}

export default function Index({ employees, departments: initialDepts, designations: initialDesigs, shifts }: Props) {
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [depts, setDepts] = useState(initialDepts);
    const [desigs, setDesigs] = useState(initialDesigs);
    const [isAddingDept, setIsAddingDept] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [isAddingDesig, setIsAddingDesig] = useState(false);
    const [newDesigTitle, setNewDesigTitle] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: 'password',
        role: 'Counselor',
        department_id: '',
        designation_id: '',
        shift_id: '',
        employment_type: 'Full-time',
        joining_date: new Date().toISOString().split('T')[0]
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.employees.store'), {
            onSuccess: () => {
                setIsAddDrawerOpen(false);
                reset();
            }
        });
    };

    const handleQuickAddDept = async () => {
        if (!newDeptName) return;
        try {
            const response = await axios.post(route('hr.departments.quick-store'), { name: newDeptName });
            setDepts([...depts, response.data]);
            setData('department_id', response.data.id.toString());
            setNewDeptName('');
            setIsAddingDept(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuickAddDesig = async () => {
        if (!newDesigTitle || !data.department_id) return;
        try {
            const response = await axios.post(route('hr.designations.quick-store'), {
                title: newDesigTitle,
                department_id: data.department_id
            });
            setDesigs([...desigs, response.data]);
            setData('designation_id', response.data.id.toString());
            setNewDesigTitle('');
            setIsAddingDesig(false);
        } catch (error) {
            console.error(error);
        }
    };

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
                {/* Compact Filter Bar */}
                <div className="bg-white px-6 py-3 border border-slate-200 rounded-xl flex items-center gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Find employee..."
                            className="w-full bg-white border-none rounded-none py-2 pl-6 pr-0 text-[13px] font-medium focus:ring-0 placeholder:text-slate-300"
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-slate-100" />
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                            <Building2 className="w-3 h-3" /> Department
                        </button>
                        <button className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                            <Filter className="w-3 h-3" /> Filter
                        </button>
                    </div>
                </div>

                {/* Clean Table Grid */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <th className="px-6 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2 font-bold uppercase italic">Employee <ArrowUpDown className="w-3 h-3 opacity-30" /></div>
                                </th>
                                <th className="px-6 py-4 border-b border-slate-100 italic">Organization</th>
                                <th className="px-6 py-4 border-b border-slate-100 italic">Core Info</th>
                                <th className="px-6 py-4 border-b border-slate-100 italic">Lifecycle</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-base shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                {emp.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-900">{emp.user.name}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{emp.employee_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-700">{emp.department?.name || 'External'}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{emp.designation?.title || 'Unassigned'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                                <Mail className="w-3 h-3 text-slate-300" /> {emp.user.email}
                                            </div>
                                            {emp.user.phone && (
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                    <Phone className="w-3 h-3 text-slate-300" /> {emp.user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", emp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{emp.status}</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase tracking-tighter shrink-0">{emp.employment_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Drawer
                isOpen={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                title="Personnel Onboarding"
                description="Initialize new talent profile within the clinical hierarchy."
                footer={
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={() => setIsAddDrawerOpen(false)} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Cancel</button>
                        <button
                            onClick={submit}
                            className="h-11 px-8 bg-slate-900 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all disabled:opacity-50"
                            disabled={processing}
                        >
                            Execute Onboarding
                        </button>
                    </div>
                }
            >
                <form className="space-y-10">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-slate-900 transition-all cursor-pointer overflow-hidden group shrink-0">
                                <UserCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Legal Identity</label>
                                    <input
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-300"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Contact</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-300"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-[1px] bg-slate-50" />

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structural Role</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all appearance-none italic"
                                >
                                    <option value="Doctor">Surgeon / Doctor</option>
                                    <option value="Counselor">Patient Counselor</option>
                                    <option value="Admin">Administrator</option>
                                    <option value="Staff">Clinical Staff</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wing / Dept</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingDept(!isAddingDept)}
                                        className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest hover:underline"
                                    >
                                        + Create New
                                    </button>
                                </div>
                                {isAddingDept ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            value={newDeptName}
                                            onChange={e => setNewDeptName(e.target.value)}
                                            className="flex-1 bg-white border-indigo-200 rounded-lg py-2 px-3 text-[12px] font-bold"
                                            placeholder="Department Name"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddDept())}
                                        />
                                        <button type="button" onClick={handleQuickAddDept} className="bg-indigo-500 text-white p-2 rounded-lg"><Check className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <select
                                        value={data.department_id}
                                        onChange={e => setData('department_id', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all italic"
                                    >
                                        <option value="">Select Wing...</option>
                                        {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</label>
                                    <button
                                        type="button"
                                        disabled={!data.department_id}
                                        onClick={() => setIsAddingDesig(!isAddingDesig)}
                                        className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest hover:underline disabled:opacity-30"
                                    >
                                        + Create New
                                    </button>
                                </div>
                                {isAddingDesig ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            value={newDesigTitle}
                                            onChange={e => setNewDesigTitle(e.target.value)}
                                            className="flex-1 bg-white border-indigo-200 rounded-lg py-2 px-3 text-[12px] font-bold"
                                            placeholder="Specialist Title"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddDesig())}
                                        />
                                        <button type="button" onClick={handleQuickAddDesig} className="bg-indigo-500 text-white p-2 rounded-lg"><Check className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <select
                                        value={data.designation_id}
                                        onChange={e => setData('designation_id', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all italic"
                                    >
                                        <option value="">Select Specialty...</option>
                                        {desigs.filter(des => des.department_id === Number(data.department_id)).map(des => (
                                            <option key={des.id} value={des.id}>{des.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Hours</label>
                                <select
                                    value={data.shift_id}
                                    onChange={e => setData('shift_id', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all italic"
                                >
                                    <option value="">Choose Shift...</option>
                                    {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarding Date</label>
                                <input
                                    type="date"
                                    value={data.joining_date}
                                    onChange={e => setData('joining_date', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg py-2.5 px-4 text-[13px] font-bold focus:border-slate-900 focus:ring-0 transition-all italic"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
