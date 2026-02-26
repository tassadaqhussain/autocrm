import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, X, FolderPlus } from 'lucide-react';
import RichTextEditor from '@/Components/RichTextEditor';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    clients: { id: number; name: string }[];
}

export default function CreateProjectDrawer({ isOpen, onClose, clients }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_name: '',
        client_id: '',
        description: '',
        start_date: '',
        deadline: '',
        status: 'Not Started',
        budget: '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Initialize New Project"
            description="Create a new operational framework for client or internal tracking."
            maxWidth="max-w-2xl"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-project-form"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> Save Project
                    </button>
                </div>
            }
        >
            <form id="create-project-form" onSubmit={handleSubmit} className="space-y-8 py-4">
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                        <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Project Framework</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 italic">
                            All projects are bound to the active clinic context and remain private until published.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                        <InputLabel value="Project Name" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                        <TextInput
                            className="w-full bg-white border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50"
                            placeholder="e.g. Q3 Clinical Audit System"
                            value={data.project_name}
                            onChange={(e) => setData('project_name', e.target.value)}
                        />
                        <InputError message={errors.project_name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Client Entity" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                        <select
                            className="w-full bg-white border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all"
                            value={data.client_id}
                            onChange={(e) => setData('client_id', e.target.value)}
                        >
                            <option value="">Internal Project</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.client_id} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Operational Budget (SAR)" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                        <TextInput
                            type="number"
                            className="w-full bg-white border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold"
                            value={data.budget}
                            onChange={(e) => setData('budget', e.target.value)}
                        />
                        <InputError message={errors.budget} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Start Date" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                        <TextInput
                            type="date"
                            className="w-full bg-white border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold uppercase tracking-tighter"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        <InputError message={errors.start_date} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Deadline" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                        <TextInput
                            type="date"
                            className="w-full bg-white border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold uppercase tracking-tighter"
                            value={data.deadline}
                            onChange={(e) => setData('deadline', e.target.value)}
                        />
                        <InputError message={errors.deadline} />
                    </div>
                </div>

                <div className="space-y-2">
                    <InputLabel value="Project Brief" className="text-[10px] uppercase tracking-widest font-black text-slate-400" />
                    <RichTextEditor
                        value={data.description}
                        onChange={(val) => setData('description', val)}
                        className="min-h-[200px]"
                    />
                    <InputError message={errors.description} />
                </div>
            </form>
        </Drawer>
    );
}
