import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    Save,
    Award,
    Building2,
    HelpCircle,
} from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface Dept {
    id: number;
    name: string;
}

interface Designation {
    id: number;
    title: string;
    department_id: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    departments: Dept[];
    designation: Designation | null;
}

export default function CreateDesignationDrawer({
    isOpen,
    onClose,
    departments,
    designation
}: Props) {
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        title: '',
        department_id: '',
    });

    useEffect(() => {
        if (designation) {
            setData({
                title: designation.title,
                department_id: String(designation.department_id),
            });
        } else {
            reset();
            if (departments.length > 0) {
                setData('department_id', String(departments[0].id));
            }
        }
    }, [designation, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (designation) {
            patch(route('hr.designations.update', designation.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('hr.designations.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={designation ? 'Edit Designation' : 'Add New Role'}
            description={designation ? `Updating ${designation.title}` : 'Define a new position in your clinic hierarchy.'}
            maxWidth="max-w-xl"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-500 text-[13px] font-bold uppercase tracking-widest hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 active:scale-95"
                    >
                        <Save className="w-4 h-4" /> {designation ? 'Update' : 'Save'}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Award className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-black text-indigo-900 uppercase tracking-tight">Designation Details</h4>
                            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Define job titles and their reporting structure.</p>
                        </div>
                    </div>

                    {/* Job Title */}
                    <div className="space-y-2">
                        <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            Job Title / Role <span className="text-rose-500">*</span>
                            <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                        </InputLabel>
                        <div className="relative">
                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Senior Dental Surgeon, Lab Manager"
                                className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-300 shadow-sm"
                                required
                            />
                        </div>
                        <InputError message={errors.title} />
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-2">
                        <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                            Assign to Department <span className="text-rose-500">*</span>
                            <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                        </InputLabel>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm outline-none appearance-none"
                                required
                            >
                                <option value="">-- Select Department --</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <InputError message={errors.department_id} />
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">Note:</span>
                            Properly categorized designations help in generating accurate payroll reports and managing employee access levels across the system.
                        </p>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}
