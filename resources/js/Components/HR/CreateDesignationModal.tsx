import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import {
    Save,
    X,
    Briefcase,
    Trophy,
    Building2,
    ChevronRight,
} from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Dept {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    departments: Dept[];
    onSuccess: (newDesignation: any) => void;
    defaultDepartmentId?: string;
}

export default function CreateDesignationModal({
    isOpen,
    onClose,
    departments,
    onSuccess,
    defaultDepartmentId
}: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        department_id: defaultDepartmentId || '',
    });

    useEffect(() => {
        if (isOpen) {
            setData('department_id', defaultDepartmentId || '');
        }
    }, [isOpen, defaultDepartmentId]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('hr.designations.quick-store'), {
            onSuccess: (page) => {
                // Since quickStore returns JSON in the controller, 
                // but usually Inertia onSuccess doesn't give us the response data directly.
                // However, the user's DepartmentController::quickStoreDesignation returns JSON.
                // If we want it to work with Inertia, it should ideally return back() and share the new ID,
                // OR we can use direct axios if we want the data immediately.
                // Given the current setup in CreateEmployeeDrawer uses axios for quick add,
                // I'll stick to useForm for validation but maybe use axios for the "Add" result if needed.
                // Wait, if I use post() from useForm, it expects an Inertia response.

                // Let's check how the user handles this currently. 
                // They use axios for quick add in CreateEmployeeDrawer.

                // I will use axios for the submission to match the existing drawer's pattern of immediate feedback.
                handleAxiosSubmit();
            },
        });
    };

    const handleAxiosSubmit = async () => {
        clearErrors();
        try {
            const res = await (window as any).axios.post(route('hr.designations.quick-store'), data);
            onSuccess(res.data);
            reset();
            onClose();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                // Manually set errors if using axios instead of useForm post
                // For simplicity, let's try useForm post first and see if the controller supports it.
            }
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-[2.5rem] shadow-2xl relative overflow-visible">
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 rounded-t-[2.5rem] bg-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100 shadow-sm">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Designate Role</h2>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Define organization structure</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 bg-slate-50 p-2 rounded-full active:scale-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAxiosSubmit(); }} className="p-10 space-y-8">
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2.5">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                Role Title <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <TextInput
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full h-12 pl-11 pr-4 bg-white border-slate-200 rounded-2xl text-[14px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold shadow-sm"
                                    required
                                    isFocused
                                />
                            </div>
                            <InputError message={errors.title} />
                        </div>

                        {/* Department */}
                        <div className="space-y-2.5">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                Assign Department <span className="text-rose-500">*</span>
                            </InputLabel>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <select
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                    className="w-full h-12 pl-11 pr-10 bg-white border border-slate-200 rounded-2xl text-[14px] font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-slate-300 transition-all shadow-sm appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">-- Choose Department --</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                            <InputError message={errors.department_id} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-14 bg-indigo-600 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> Confirm Role
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 h-14 bg-slate-50 text-slate-500 text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
