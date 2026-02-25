import { useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import {
    Handshake,
    Plus,
    ChevronDown,
    Save,
    RotateCcw,
    DollarSign,
    Calendar,
    Users,
    Package,
    Eye,
    Check,
    X
} from 'lucide-react';
import Modal from '@/Components/Modal';
import Drawer from '@/Components/Drawer';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { cn } from '@/lib/utils';

interface Lead {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    leads?: Lead[];
    agents?: User[];
    products?: Product[];
    categories?: Category[];
}

export default function CreateDealDrawer({
    isOpen,
    onClose,
    leads = [],
    agents = [],
    products = [],
    categories = []
}: Props) {
    const { props } = usePage();
    const authUser = (props.auth as any)?.user;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'agent' | 'category'>('agent');
    const [newLabel, setNewLabel] = useState('');

    const initialData = {
        lead_id: '',
        name: '',
        pipeline: 'Sales Pipeline',
        stage: 'Generated',
        value: '0',
        close_date: new Date().toISOString().split('T')[0],
        category: '',
        agent_id: '',
        product_ids: [] as string[],
        watcher_id: authUser?.id?.toString() || '',
    };

    const [pendingSelection, setPendingSelection] = useState<{ type: 'agent' | 'category', name: string } | null>(null);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm(initialData);

    useEffect(() => {
        if (recentlySuccessful) {
            reset();
            onClose();
        }
    }, [recentlySuccessful]);

    // Auto-select newly added category or agent when props refresh
    useEffect(() => {
        if (pendingSelection) {
            if (pendingSelection.type === 'category') {
                const found = categories.find(c => c.name === pendingSelection.name);
                if (found) {
                    setData('category', found.name);
                    setPendingSelection(null);
                }
            } else if (pendingSelection.type === 'agent') {
                const found = agents.find(a => a.name === pendingSelection.name);
                if (found) {
                    setData('agent_id', found.id.toString());
                    setPendingSelection(null);
                }
            }
        }
    }, [categories, agents, pendingSelection]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('deals.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    const handleSaveAndAddMore = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('deals.store'), {
            onSuccess: () => {
                reset();
                // We don't close the drawer here
            }
        });
    };

    const openAddModal = (type: 'agent' | 'category') => {
        setModalType(type);
        setNewLabel('');
        setIsAddModalOpen(true);
    };

    return (
        <>
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                title="Add Deal info"
                maxWidth="max-w-[75vw]"
                footer={
                    <div className="flex items-center justify-between w-full">
                        <button
                            type="button"
                            onClick={() => {
                                const dealNames = ['Custom Apparel Design', 'Bulk DTF Printing', 'Corporate Branding Package', 'Seasonal Collection Set'];
                                const categories = ['Tshirt and DTF', 'Embroidery', 'Screen Printing'];

                                setData({
                                    ...data,
                                    name: dealNames[Math.floor(Math.random() * dealNames.length)],
                                    value: (Math.floor(Math.random() * 5000) + 500).toString(),
                                    category: categories[Math.floor(Math.random() * categories.length)],
                                    close_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
                                    lead_id: leads.length > 0 ? leads[Math.floor(Math.random() * leads.length)].id.toString() : '',
                                    agent_id: agents.length > 0 ? agents[Math.floor(Math.random() * agents.length)].id.toString() : '',
                                });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-[12px] font-bold uppercase tracking-wider rounded-lg hover:bg-amber-100 transition-all border border-amber-100/50"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Magic Fill
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button
                                onClick={handleSaveAndAddMore}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Save className="w-4 h-4" /> Save & Add More
                            </button>
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 bg-transparent text-slate-400 text-[13px] font-semibold hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Deal Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Lead Contacts <span className="text-rose-500">*</span>
                                </InputLabel>
                                <select
                                    value={data.lead_id}
                                    onChange={e => setData('lead_id', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="">--</option>
                                    {leads.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.lead_id} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Deal Name <span className="text-rose-500">*</span> <Handshake className="w-3.5 h-3.5 text-slate-400" />
                                </InputLabel>
                                <TextInput
                                    placeholder="e.g. John Doe"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Pipeline <span className="text-rose-500">*</span> <Package className="w-3.5 h-3.5 text-slate-400" />
                                </InputLabel>
                                <select
                                    value={data.pipeline}
                                    onChange={e => setData('pipeline', e.target.value)}
                                    className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="Sales Pipeline">Sales Pipeline</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Deal Stages <span className="text-rose-500">*</span>
                                </InputLabel>
                                <div className="relative">
                                    <select
                                        value={data.stage}
                                        onChange={e => setData('stage', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 pl-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                    >
                                        <option value="Generated">Generated</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Initial Contact">Initial Contact</option>
                                        <option value="Schedule Appointment">Schedule Appointment</option>
                                        <option value="Proposal Sent">Proposal Sent</option>
                                        <option value="Win">Win</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.stage} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Deal Value <span className="text-rose-500">*</span>
                                </InputLabel>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 h-11 px-3 flex items-center bg-slate-50 border-r border-slate-200 rounded-l-lg text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                        USD ($)
                                    </div>
                                    <input
                                        type="number"
                                        value={data.value}
                                        onChange={e => setData('value', e.target.value)}
                                        className="w-full pl-20 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <InputError message={errors.value} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                                    Close Date <span className="text-rose-500">*</span>
                                </InputLabel>
                                <div className="relative">
                                    <TextInput
                                        type="date"
                                        value={data.close_date}
                                        onChange={e => setData('close_date', e.target.value)}
                                        className="w-full bg-white border-slate-200 rounded-lg text-[13px] h-11 pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.close_date} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Deal Category</InputLabel>
                                <div className="flex gap-2">
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => openAddModal('category')}
                                        className="px-5 h-11 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all border border-[#4358E4] text-[#4358E4] hover:bg-indigo-50 shrink-0"
                                    >
                                        ADD
                                    </button>
                                </div>
                                <InputError message={errors.category} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Deal Agent</InputLabel>
                                <div className="flex gap-2">
                                    <select
                                        value={data.agent_id}
                                        onChange={e => setData('agent_id', e.target.value)}
                                        className="flex-1 bg-white border-slate-200 rounded-lg text-[13px] h-11 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">--</option>
                                        {agents.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => openAddModal('agent')}
                                        className="px-5 h-11 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all border border-[#4358E4] text-[#4358E4] hover:bg-indigo-50 shrink-0"
                                    >
                                        ADD
                                    </button>
                                </div>
                                <InputError message={errors.agent_id} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Products</InputLabel>
                                <div className="relative">
                                    <select
                                        multiple
                                        value={data.product_ids}
                                        onChange={e => {
                                            const selectedOptions = Array.from(e.target.selectedOptions).map(o => o.value);
                                            setData('product_ids', selectedOptions);
                                        }}
                                        className="w-full bg-white border-slate-200 rounded-lg text-[13px] min-h-[44px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none p-3"
                                    >
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                            <div className="space-y-2">
                                <InputLabel className="text-[13px] text-slate-600 font-medium">Deal Watcher</InputLabel>
                                <div className="w-full bg-white border border-slate-200 rounded-xl px-4 h-11 flex items-center justify-between text-[13px] shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm border border-indigo-200/50">
                                            {authUser?.name?.charAt(0) || 'A'}
                                        </div>
                                        <span className="font-bold text-slate-700">{authUser?.name || 'Admin'}</span>
                                        <span className="px-2.5 py-1 bg-[#101828] text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl">IT'S YOU</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="2xl">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                            Add New Deal {modalType === 'agent' ? 'Agent' : 'Category'}
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-10">
                        <div className="space-y-3">
                            <InputLabel className="text-[13px] text-slate-600 font-bold flex items-center gap-1">
                                {modalType === 'agent' ? 'Agent Name' : 'Category Name'} <span className="text-rose-500">*</span>
                            </InputLabel>
                            <TextInput
                                value={newLabel}
                                onChange={e => setNewLabel(e.target.value)}
                                placeholder={`Enter ${modalType}...`}
                                className="w-full bg-white border-slate-200 rounded-lg text-sm h-14 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-slate-50 flex items-center justify-end gap-6">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                if (newLabel) {
                                    const routeName = modalType === 'category' ? 'deals.categories.quick' : 'deals.agents.quick';
                                    router.post(route(routeName), { name: newLabel }, {
                                        onSuccess: () => {
                                            setPendingSelection({ type: modalType, name: newLabel });
                                            setIsAddModalOpen(false);
                                            setNewLabel('');
                                        },
                                        preserveState: true,
                                    });
                                }
                            }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                        >
                            <Check className="w-4 h-4 stroke-[3px]" /> Save
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
