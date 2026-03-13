import Modal from '@/Components/Modal';
import { X } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';

interface ContractType {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    contractTypes: ContractType[];
}

export default function ContractTypeModal({ isOpen, onClose, contractTypes }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        name: ''
    });

    const handleSave = () => {
        if (!data.name.trim()) return;

        post(route('work.contract-types.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white rounded-xl shadow-lg flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">Contract Type</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
                    {/* Table Area */}
                    <div className="border border-slate-200 bg-white rounded-md mb-6 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-[#f0f2f5] text-slate-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium border-b border-slate-200 w-16">#</th>
                                    <th className="px-4 py-3 font-medium border-b border-slate-200">Category Name</th>
                                    <th className="px-4 py-3 font-medium border-b border-slate-200 text-right w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contractTypes.length > 0 ? (
                                    contractTypes.map((type, index) => (
                                        <tr key={type.id}>
                                            <td className="px-4 py-3 border-b border-slate-100">{index + 1}</td>
                                            <td className="px-4 py-3 border-b border-slate-100">{type.name}</td>
                                            <td className="px-4 py-3 border-b border-slate-100 text-right">
                                                --
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                </svg>
                                                <span>- No record found. -</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Form */}
                    <div className="pt-2">
                        <InputLabel htmlFor="category_name" className="mb-2 text-slate-600 font-normal">
                            Name <span className="text-red-500">*</span>
                        </InputLabel>
                        <TextInput
                            id="category_name"
                            placeholder="Enter a category name"
                            className="w-full border-slate-200 shadow-none text-sm py-2"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-white rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        className="px-5 py-2 bg-[#1d82f5] hover:bg-[#1669c1] text-white text-sm font-medium rounded shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
