import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, X, Trash2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: number; name: string }[];
}

export default function ProjectCategoryModal({ isOpen, onClose, categories }: Props) {
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('work.project-categories.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(route('work.project-categories.destroy', id));
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Project Category</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-8 border border-slate-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-4 py-3 border-b border-slate-100 w-12 text-center">#</th>
                                <th className="px-4 py-3 border-b border-slate-100">Category Name</th>
                                <th className="px-4 py-3 border-b border-slate-100 w-24 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-400 text-center">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{cat.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                            <X className="w-5 h-5 opacity-20" />
                                        </div>
                                        <span className="text-xs font-medium uppercase tracking-widest">- No record found. -</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                        <InputLabel value="Category Name" isRequired className="text-slate-500 font-normal" />
                        <TextInput
                            className="w-full border-slate-200 shadow-none text-sm py-2"
                            placeholder="Enter a category name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-2 bg-[#1d82f5] text-white text-sm font-medium rounded hover:bg-[#1669c1] transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
