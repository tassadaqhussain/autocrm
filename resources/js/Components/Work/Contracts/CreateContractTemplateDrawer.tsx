import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
    Check, HelpCircle, Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Image as ImageIcon, Link2, Type, Smile,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { useState } from 'react';
import ContractTypeModal from './ContractTypeModal';

interface ContractType {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    contractTypes: ContractType[];
}

export default function CreateContractTemplateDrawer({ isOpen, onClose, contractTypes }: Props) {
    const [typeModalOpen, setTypeModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        description: '',
        contract_type_id: '',
        amount: '',
        currency: 'USD ($)',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contracts.templates.store'), {
            onSuccess: () => {
                onClose();
                reset();
            }
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add Contract Template"
            maxWidth="max-w-[1200px]" // Wide drawer to match the screenshot
        >
            <form id="createContractTemplateForm" onSubmit={handleSubmit} className="px-2">

                {/* Contract Details */}
                <div className="mb-12">
                    <h3 className="text-xl text-slate-800 mb-8 border-b border-slate-100 pb-4">Contract Details</h3>

                    <div>
                        {/* Row 1: Subject */}
                        <div className="mb-8">
                            <InputLabel htmlFor="subject" className="mb-2 text-slate-500 text-sm font-normal">
                                Subject <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="subject"
                                type="text"
                                className="block w-full border-slate-200 shadow-none text-sm py-2"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                required
                            />
                            <InputError message={errors.subject} className="mt-2" />
                        </div>

                        {/* Row 2: Description (Rich Text Editor Mock) */}
                        <div className="mb-8">
                            <InputLabel htmlFor="description" className="mb-2 text-slate-500 text-sm font-normal">
                                Description
                            </InputLabel>
                            <div className="border border-slate-200 rounded-md overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-white flex-wrap">
                                    <button type="button" className="px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1">
                                        Normal <span className="text-[10px]">▼</span>
                                    </button>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><List className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><ListOrdered className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Bold className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Italic className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Underline className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Strikethrough className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><ImageIcon className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Link2 className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><Type className="w-4 h-4" /></button>
                                    <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded italic font-serif">I<sub>x</sub></button>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        className="block w-full border-0 focus:ring-0 text-sm min-h-[160px] resize-y p-4 text-slate-700"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <div className="absolute bottom-2 right-2 text-slate-400">
                                        <Smile className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Contract Type, Contract Value, Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                            <div>
                                <InputLabel htmlFor="contract_type_id" className="mb-2 text-slate-500 text-sm font-normal">
                                    Contract Type <span className="text-red-500">*</span>
                                </InputLabel>
                                <div className="flex gap-2">
                                    <select
                                        id="contract_type_id"
                                        className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                        value={data.contract_type_id}
                                        onChange={(e) => setData('contract_type_id', e.target.value)}
                                    >
                                        <option value="">--</option>
                                        {contractTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => setTypeModalOpen(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 border-l-0 -ml-2 rounded-l-none">
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="amount" className="mb-2 text-slate-500 text-sm font-normal">
                                    <div className="flex items-center gap-1">
                                        Contract Value <span className="text-red-500">*</span>
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                </InputLabel>
                                <TextInput
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    className="block w-full border-slate-200 shadow-none text-sm py-2"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={errors.amount} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="currency" className="mb-2 text-slate-500 text-sm font-normal">
                                    Currency
                                </InputLabel>
                                <select
                                    id="currency"
                                    className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-700"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                >
                                    <option value="USD ($)">USD ($)</option>
                                    <option value="EUR (€)">EUR (€)</option>
                                    <option value="SAR (SAR)">SAR (SAR)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pb-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#1d82f5] hover:bg-[#1669c1] text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="text-slate-500 hover:text-slate-700 px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <ContractTypeModal
                isOpen={typeModalOpen}
                onClose={() => setTypeModalOpen(false)}
                contractTypes={contractTypes}
            />
        </Drawer>
    );
}
