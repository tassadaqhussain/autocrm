import { useForm } from '@inertiajs/react';
import {
    Save,
    X,
    Building2,
    Activity,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newDepartment: any) => void;
}

export default function CreateDepartmentModal({ isOpen, onClose, onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const handleAxiosSubmit = async () => {
        clearErrors();
        try {
            const res = await (window as any).axios.post(route('hr.departments.quick-store'), data);
            onSuccess(res.data);
            reset();
            onClose();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50 bg-white shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 border border-indigo-100 shadow-sm ring-4 ring-indigo-50/50">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic leading-tight">New Department</h2>
                            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                <Activity className="w-3 h-3 text-indigo-400" /> Structure clinical units
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 bg-slate-50 p-2.5 rounded-full active:scale-90 shadow-sm border border-slate-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAxiosSubmit(); }} className="p-10 space-y-10">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Name */}
                        <div className="space-y-3">
                            <InputLabel className="text-[12px] text-slate-500 font-black uppercase tracking-widest pl-1">
                                Department Identity <span className="text-rose-500 font-bold ml-1">*</span>
                            </InputLabel>
                            <div className="relative group">
                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <TextInput
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Orthopedics, Logistics"
                                    className="w-full h-14 pl-14 pr-5 bg-white border-slate-200 rounded-2xl text-[15px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm font-semibold group-hover:border-slate-300 transition-all font-sans"
                                    required
                                    isFocused
                                />
                            </div>
                            <div className="flex items-center gap-2 pl-1 mt-1">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global organizational unit identifier</span>
                            </div>
                            <InputError message={errors.name} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 bg-indigo-600 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 ring-4 ring-indigo-50"
                        >
                            <Save className="w-5 h-5" /> Assemble Unit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full h-14 bg-slate-50 text-slate-500 text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 border border-slate-100 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
