import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, X, HelpCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickClientModal({ isOpen, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company_name: '',
        login_allowed: false,
        status: 'Active', // Required by StoreClientDTO/Request likely
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">Client</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <InputLabel value="Client Name" isRequired className="text-slate-500 font-normal" />
                        <TextInput
                            className="w-full border-slate-200 shadow-none text-sm py-2"
                            placeholder="e.g. John Doe"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <InputLabel value="Email" className="text-slate-500 font-normal" />
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                        </div>
                        <TextInput
                            type="email"
                            className="w-full border-slate-200 shadow-none text-sm py-2"
                            placeholder="e.g. johndoe@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Company Name" className="text-slate-500 font-normal" />
                        <TextInput
                            className="w-full border-slate-200 shadow-none text-sm py-2"
                            placeholder="e.g. Acme Corporation"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                        />
                        <InputError message={errors.company_name} />
                    </div>

                    <div className="space-y-3">
                        <InputLabel value="Login Allowed?" className="text-slate-500 font-normal" />
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="login_allowed"
                                    checked={data.login_allowed}
                                    onChange={() => setData('login_allowed', true)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-600">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="login_allowed"
                                    checked={!data.login_allowed}
                                    onChange={() => setData('login_allowed', false)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-600">No</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-10">
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
