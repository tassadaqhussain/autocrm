import Modal from '@/Components/Modal';
import { X, Check, HelpCircle } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ClientModal({ isOpen, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company_name: '',
        login_allowed: false,
        status: 'Active', // Default status required by StoreClientRequest
    });

    const handleSubmit: FormEventHandler = (e) => {
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
            <div className="bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Client</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Body */}
                    <div className="p-6 space-y-6 bg-white">
                        {/* Client Name */}
                        <div>
                            <InputLabel htmlFor="modal_client_name" className="mb-2 text-slate-500 font-medium text-sm">
                                Client Name <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="modal_client_name"
                                placeholder="e.g. John Doe"
                                className="w-full border-slate-200 shadow-none text-sm py-2.5 px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <InputLabel htmlFor="modal_email" className="text-slate-500 font-medium text-sm">
                                    Email
                                </InputLabel>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </div>
                            <TextInput
                                id="modal_email"
                                type="email"
                                placeholder="e.g. johndoe@example.com"
                                className="w-full border-slate-200 shadow-none text-sm py-2.5 px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        {/* Company Name */}
                        <div>
                            <InputLabel htmlFor="modal_company_name" className="mb-2 text-slate-500 font-medium text-sm">
                                Company Name
                            </InputLabel>
                            <TextInput
                                id="modal_company_name"
                                placeholder="e.g. Acme Corporation"
                                className="w-full border-slate-200 shadow-none text-sm py-2.5 px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                            />
                            <InputError message={errors.company_name} className="mt-1.5" />
                        </div>

                        {/* Login Allowed */}
                        <div>
                            <p className="text-slate-500 font-medium text-sm mb-3">Login Allowed?</p>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center h-5 w-5">
                                        <input
                                            type="radio"
                                            name="login_allowed"
                                            className=" peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-500 transition-all"
                                            checked={data.login_allowed === true}
                                            onChange={() => setData('login_allowed', true)}
                                        />
                                        <span className="absolute bg-blue-500 w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity"></span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Yes</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center h-5 w-5">
                                        <input
                                            type="radio"
                                            name="login_allowed"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-500 transition-all"
                                            checked={data.login_allowed === false}
                                            onChange={() => setData('login_allowed', false)}
                                        />
                                        <span className="absolute bg-blue-500 w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity"></span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">No</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50/30">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-slate-500 hover:text-slate-700 font-semibold transition-colors"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#1d82f5] hover:bg-[#1669c1] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            <Check className="w-4 h-4 stroke-[3px]" /> Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
