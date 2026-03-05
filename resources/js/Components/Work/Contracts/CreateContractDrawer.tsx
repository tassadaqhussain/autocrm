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
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import ContractTypeModal from './ContractTypeModal';
import ClientModal from './ClientModal';

interface Client {
    id: number;
    name: string;
}

interface ContractType {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    projects: { id: number; project_name: string }[];
    contractTypes: ContractType[];
}

export default function CreateContractDrawer({ isOpen, onClose, clients, projects, contractTypes }: Props) {
    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const prevClientsLength = useRef(clients.length);

    const { data, setData, post, processing, errors, reset } = useForm({
        contract_number: '1',
        subject: '',
        project_id: '',
        description: '',
        start_date: '',
        end_date: '',
        without_due_date: false,
        contract_type_id: '',
        amount: '',
        currency: 'USD ($)',
        client_id: '',
        cell: '',
        office_phone: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        alternate_address: '',
        notes: '',
    });

    // Auto-select the latest client when a new one is added
    useEffect(() => {
        if (clients.length > prevClientsLength.current) {
            const latestClient = clients[clients.length - 1];
            if (latestClient) {
                setData('client_id', latestClient.id.toString());
            }
        }
        prevClientsLength.current = clients.length;
    }, [clients]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        // Adjust standard submit for the mock/updated fields
        post(route('contracts.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const fillDemoData = () => {
        setData({
            contract_number: Math.floor(Math.random() * 1000).toString(),
            subject: 'Website Redesign & SEO',
            project_id: '',
            description: 'Complete redesign of corporate website including on-page SEO optimization.',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            without_due_date: false,
            contract_type_id: contractTypes.length > 0 ? contractTypes[0].id.toString() : '',
            amount: '15000.00',
            currency: 'USD ($)',
            client_id: clients.length > 0 ? clients[0].id.toString() : '',
            cell: '+15550198234',
            office_phone: '+18001234567',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postal_code: '10001',
            alternate_address: 'Suite 400, Tech Building',
            notes: 'Test auto-generated notes.',
        });
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Add Contract"
            maxWidth="max-w-[1200px]" // Wide drawer to match the screenshot
        >
            <form id="createContractForm" onSubmit={handleSubmit} className="px-2">

                {/* Contract Details */}
                <div className="mb-12">
                    <h3 className="text-xl text-slate-800 mb-8 border-b border-slate-100 pb-4">Contract Details</h3>

                    {/* Row 1: Contract Number & Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                            <InputLabel htmlFor="contract_number" className="mb-2 text-slate-500 font-normal">
                                Contract Number <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="flex rounded-md shadow-sm border border-slate-200">
                                <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 text-sm border-r border-slate-200">
                                    CONT#00
                                </span>
                                <input
                                    id="contract_number"
                                    type="text"
                                    className="flex-1 block w-full rounded-none rounded-r-md border-0 focus:ring-0 text-sm py-2 px-3 text-slate-700"
                                    value={data.contract_number}
                                    onChange={(e) => setData('contract_number', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="subject" className="mb-2 text-slate-500 font-normal">
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
                    </div>

                    {/* Row 2: Project */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <InputLabel htmlFor="project_id" value="Project" className="mb-2 text-slate-500 font-normal" />
                            <select
                                id="project_id"
                                className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                            >
                                <option value="">--</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.project_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Description (Rich Text Editor Mock) */}
                    <div className="mb-8">
                        <InputLabel htmlFor="description" value="Description" className="mb-2 text-slate-500 font-normal" />
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
                                <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><AlignLeft className="w-4 h-4" /></button>
                                <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><AlignCenter className="w-4 h-4" /></button>
                                <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><AlignRight className="w-4 h-4" /></button>
                                <button type="button" className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"><AlignJustify className="w-4 h-4" /></button>
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
                                    className="block w-full border-0 focus:ring-0 text-sm min-h-[120px] resize-y p-4 text-slate-700"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <div className="absolute bottom-2 right-2 text-slate-400">
                                    <Smile className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Start Date, End Date, Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 items-end">
                        <div>
                            <InputLabel htmlFor="start_date" className="mb-2 text-slate-500 font-normal">
                                Start Date <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="start_date"
                                type="date"
                                className="block w-full border-slate-200 shadow-none text-sm py-2 text-slate-500"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <InputLabel htmlFor="end_date" value="End Date" className="mb-2 text-slate-500 font-normal" />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        className="block w-full border-slate-200 shadow-none text-sm py-2 text-slate-500"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        disabled={data.without_due_date}
                                    />
                                </div>
                                <div className="flex items-center mt-8 space-x-2">
                                    <input
                                        type="checkbox"
                                        id="without_due_date"
                                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4"
                                        checked={data.without_due_date}
                                        onChange={(e) => setData('without_due_date', e.target.checked)}
                                    />
                                    <label htmlFor="without_due_date" className="text-sm text-slate-500">
                                        Without Due Date
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="contract_type_id" className="mb-2 text-slate-500 font-normal">
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
                                    {contractTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => setTypeModalOpen(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Row 5: Contract Value, Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        <div>
                            <InputLabel htmlFor="amount" className="mb-2 text-slate-500 font-normal">
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
                            <InputLabel htmlFor="currency" value="Currency" className="mb-2 text-slate-500 font-normal" />
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

                {/* Client Details */}
                <div className="mb-12">
                    <h3 className="text-xl text-slate-800 mb-8 border-b border-slate-100 pb-4">Client Details</h3>

                    {/* Row 1: Client, Cell, Office Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        <div>
                            <InputLabel htmlFor="client_id" className="mb-2 text-slate-500 font-normal">
                                Client <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="flex gap-2">
                                <select
                                    id="client_id"
                                    className="flex-1 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 text-slate-500"
                                    value={data.client_id}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('client_id', e.target.value)}
                                    required
                                >
                                    <option value="">--</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => setClientModalOpen(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                                    Add
                                </button>
                            </div>
                            <InputError message={errors.client_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="cell" value="Cell" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="cell"
                                type="text"
                                className="block w-full border-slate-200 shadow-none text-sm py-2"
                                value={data.cell}
                                onChange={(e) => setData('cell', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="office_phone" value="Office Phone Number" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="office_phone"
                                type="text"
                                placeholder="e.g. +19876543"
                                className="block w-full border-slate-200 shadow-none text-sm py-2 placeholder:text-slate-400"
                                value={data.office_phone}
                                onChange={(e) => setData('office_phone', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 2: City, State, Country, Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                        <div>
                            <InputLabel htmlFor="city" value="City" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="city"
                                type="text"
                                placeholder="e.g. New York, Jaipur, Dubai"
                                className="block w-full border-slate-200 shadow-none text-sm py-2 placeholder:text-slate-400"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="state" value="State" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="state"
                                type="text"
                                placeholder="e.g. California, Rajasthan, Dubai"
                                className="block w-full border-slate-200 shadow-none text-sm py-2 placeholder:text-slate-400"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="country" value="Country" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="country"
                                type="text"
                                className="block w-full border-slate-200 shadow-none text-sm py-2"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="postal_code" value="Postal code" className="mb-2 text-slate-500 font-normal" />
                            <TextInput
                                id="postal_code"
                                type="text"
                                placeholder="e.g. 90250"
                                className="block w-full border-slate-200 shadow-none text-sm py-2 placeholder:text-slate-400"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 3: Alternate Address, Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
                        <div>
                            <InputLabel htmlFor="alternate_address" value="Alternate Address" className="mb-2 text-slate-500 font-normal" />
                            <textarea
                                id="alternate_address"
                                placeholder="e.g. 132, My Street, Kingston, New York 12401"
                                className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 placeholder:text-slate-400 min-h-[100px] resize-y"
                                value={data.alternate_address}
                                onChange={(e) => setData('alternate_address', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes" className="mb-2 text-slate-500 font-normal" />
                            <textarea
                                id="notes"
                                className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-none text-sm py-2 min-h-[100px] resize-y"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pb-8 border-t border-slate-100 pt-6 mt-6">
                    <div className="flex gap-3">
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
                    <button
                        type="button"
                        onClick={fillDemoData}
                        className="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded transition-colors uppercase tracking-widest"
                    >
                        Auto Fill Demo Data
                    </button>
                </div>
            </form>

            <ContractTypeModal
                isOpen={typeModalOpen}
                onClose={() => setTypeModalOpen(false)}
                contractTypes={contractTypes}
            />

            <ClientModal
                isOpen={clientModalOpen}
                onClose={() => setClientModalOpen(false)}
            />
        </Drawer>
    );
}
