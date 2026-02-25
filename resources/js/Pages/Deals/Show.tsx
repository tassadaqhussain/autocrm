import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import FileUpload from '@/Components/FileUpload/FileUpload';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Mail,
    Phone,
    MoreHorizontal,
    User as UserIcon,
    Calendar,
    DollarSign,
    Tag,
    Package,
    Eye,
    Plus,
    Clock,
    FileText,
    StickyNote,
    History,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Download,
    Trash2,
    X,
    Check
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Deal {
    id: number;
    name: string;
    pipeline: string;
    stage: string;
    value: string;
    category: string;
    close_date: string;
    lead?: {
        name: string;
        email?: string;
        phone?: string;
        company_name?: string;
    };
    agent?: {
        name: string;
        avatar?: string;
        role?: string;
    };
    watcher?: {
        name: string;
        avatar?: string;
    };
    follow_ups: any[];
    proposals: Array<{
        id: number;
        proposal_number: string;
        total_amount: string;
        proposal_date: string;
        valid_until: string;
        status: string;
        files: Array<{ id: number; name: string; path: string; size: number; type: string }>;
    }>;
    notes: any[];
    files: Array<{ id: number; name: string; path: string; size: number; type: string }>;
}

interface Props {
    deal: Deal;
}

export default function Show({ deal }: Props) {
    const [activeTab, setActiveTab] = useState('Files');
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
    const [isAddFollowUpOpen, setIsAddFollowUpOpen] = useState(false);
    const [isAddProposalOpen, setIsAddProposalOpen] = useState(false);
    const tabs = [
        { id: 'Files', label: 'Files', icon: FileText },
        { id: 'Follow Up', label: 'Follow Up', icon: Clock },
        { id: 'Proposal', label: 'Proposal', icon: FileText },
        { id: 'Notes', label: 'Notes', icon: StickyNote },
        { id: 'History', label: 'History', icon: History },
    ];

    const noteForm = useForm({
        detail: '',
    });

    const followUpForm = useForm({
        next_follow_up_date: new Date().toISOString().split('T')[0],
        start_time: '',
        send_reminder: false,
        remark: '',
        status: 'Pending',
    });

    const proposalForm = useForm({
        proposal_number: `PROP-${Math.floor(Math.random() * 10000)}`,
        total_amount: deal.value,
        proposal_date: new Date().toISOString().split('T')[0],
        valid_until: '',
        status: 'Draft',
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(route('deals.notes.store', deal.id), {
            onSuccess: () => {
                noteForm.reset();
                setIsAddNoteOpen(false);
            }
        });
    };

    const submitFollowUp = (e: React.FormEvent) => {
        e.preventDefault();
        followUpForm.post(route('deals.follow-ups.store', deal.id), {
            onSuccess: () => {
                followUpForm.reset();
                setIsAddFollowUpOpen(false);
            }
        });
    };

    const submitProposal = (e: React.FormEvent) => {
        e.preventDefault();
        proposalForm.post(route('deals.proposals.store', deal.id), {
            onSuccess: () => {
                proposalForm.reset();
                setIsAddProposalOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <Link href={route('dashboard')} className="hover:text-indigo-600">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href={route('leads.index', { view: 'pipeline' })} className="hover:text-indigo-600">Deals</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-600">{deal.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{deal.name}</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-blue-100">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                Setup Progress
                                <div className="w-20 h-1.5 bg-blue-200 rounded-full ml-2 overflow-hidden">
                                    <div className="w-5/6 h-full bg-blue-600" />
                                </div>
                                <span className="ml-1">5/6</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Deal - ${deal.name}`} />

            <div className="grid grid-cols-12 gap-6 p-6">
                {/* Left Column - Deal Info & Tabs */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    {/* Deal Info Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 flex justify-between items-start">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Deal Info</h3>
                            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="px-8 pb-10">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-tight border border-indigo-100/50">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    {deal.pipeline}
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tight border border-amber-100/50">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    {deal.stage}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 text-[13px]">
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal Name</span>
                                    <span className="col-span-2 text-slate-700 font-bold">{deal.name}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lead Contact</span>
                                    <span className="col-span-2 text-indigo-600 font-bold hover:underline cursor-pointer">{deal.lead?.name}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Email</span>
                                    <span className="col-span-2 text-slate-600 font-medium italic">{deal.lead?.email || '--'}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Company Name</span>
                                    <span className="col-span-2 text-slate-600 font-medium">--</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal Category</span>
                                    <span className="col-span-2 text-slate-700 font-bold">{deal.category || 'Tshirt and DTF'}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal Agent</span>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                                            <UserIcon className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 leading-none">{deal.agent?.name || 'Unassigned'}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{deal.agent?.role || 'Manager'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal Watcher</span>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <UserIcon className="w-4 h-4 text-slate-300" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-600 leading-none lowercase tracking-tight">{deal.watcher?.name || 'admin'}</span>
                                            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded uppercase tracking-tighter shadow-sm">It's you</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Close Date</span>
                                    <span className="col-span-2 text-slate-600 font-bold">{new Date(deal.close_date).toLocaleDateString()}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal Value</span>
                                    <span className="col-span-2 text-slate-900 font-black">${parseFloat(deal.value).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-3 items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Products</span>
                                    <span className="col-span-2 text-slate-600 font-medium italic">--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="flex border-b border-slate-100 px-8 overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-8 py-6 text-sm font-bold transition-all relative whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "text-indigo-600"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.3)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="p-8">
                            {activeTab === 'Files' && (
                                <div className="space-y-6">
                                    <FileUpload
                                        uploadRoute="deals.files.upload"
                                        uploadRouteParams={{ deal: deal.id }}
                                        deleteRoute="deals.files.destroy"
                                        getDeleteRouteParams={(file) => ({ deal: deal.id, file: file.id })}
                                        files={deal.files ?? []}
                                        title="Upload File"
                                        emptyMessage="No file uploaded."
                                    />
                                </div>
                            )}

                            {activeTab === 'Follow Up' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddFollowUpOpen(true)}
                                            className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform"
                                        >
                                            <Plus className="w-5 h-5" />
                                            New Follow Up
                                        </button>
                                    </div>

                                    <div className="overflow-hidden border border-slate-100 rounded-[2rem] shadow-sm bg-white">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Remark</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {deal.follow_ups.length > 0 ? (
                                                    deal.follow_ups.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                                            <td className="px-8 py-5 text-[13px] font-bold text-slate-700">{new Date(item.next_follow_up_date).toLocaleDateString()}</td>
                                                            <td className="px-8 py-5 text-[13px] text-slate-600">{item.remark || '--'}</td>
                                                            <td className="px-8 py-5 text-center">
                                                                <span className={cn(
                                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                                                    item.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                                )}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5 text-right">
                                                                <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="py-20 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <Clock className="w-8 h-8 text-slate-200 mb-4" />
                                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">- No record found. -</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Proposal' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setIsAddProposalOpen(!isAddProposalOpen)}
                                            className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform"
                                        >
                                            <Plus className={cn("w-5 h-5 transition-transform", isAddProposalOpen && "rotate-45")} />
                                            {isAddProposalOpen ? 'Close Form' : 'Create Proposal'}
                                        </button>
                                    </div>

                                    {isAddProposalOpen && (
                                        <form onSubmit={submitProposal} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Proposal #</label>
                                                    <input
                                                        type="text"
                                                        value={proposalForm.data.proposal_number}
                                                        onChange={e => proposalForm.setData('proposal_number', e.target.value)}
                                                        className="h-11 rounded-xl border-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-bold"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Value</label>
                                                    <input
                                                        type="number"
                                                        value={proposalForm.data.total_amount}
                                                        onChange={e => proposalForm.setData('total_amount', e.target.value)}
                                                        className="h-11 rounded-xl border-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-bold"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                                                    <input
                                                        type="date"
                                                        value={proposalForm.data.proposal_date}
                                                        onChange={e => proposalForm.setData('proposal_date', e.target.value)}
                                                        className="h-11 rounded-xl border-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-bold"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valid Till</label>
                                                    <input
                                                        type="date"
                                                        value={proposalForm.data.valid_until}
                                                        onChange={e => proposalForm.setData('valid_until', e.target.value)}
                                                        className="h-11 rounded-xl border-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-bold"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={proposalForm.processing}
                                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                                                >
                                                    Create Proposal
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="overflow-hidden border border-slate-100 rounded-[2rem] shadow-sm bg-white">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Proposal ID</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Total</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Date</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Files</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {deal.proposals.length > 0 ? (
                                                    deal.proposals.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                                            <td className="px-8 py-5 text-[13px] font-black text-indigo-600">{item.proposal_number}</td>
                                                            <td className="px-8 py-5 text-[13px] font-black text-slate-900 text-center">${parseFloat(item.total_amount).toLocaleString()}</td>
                                                            <td className="px-8 py-5 text-[13px] font-bold text-slate-600 text-center">{new Date(item.proposal_date).toLocaleDateString()}</td>
                                                            <td className="px-8 py-5 text-center">
                                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <FileUpload
                                                                    uploadRoute="deals.proposals.files.upload"
                                                                    uploadRouteParams={{ deal: deal.id, proposal: item.id }}
                                                                    deleteRoute="deals.proposals.files.destroy"
                                                                    getDeleteRouteParams={(file) => ({ deal: deal.id, proposal: item.id, file: file.id })}
                                                                    files={item.files ?? []}
                                                                    title="Attach"
                                                                    emptyMessage="No files"
                                                                    compact
                                                                />
                                                            </td>
                                                            <td className="px-8 py-5 text-right">
                                                                <a href="#" className="p-2 text-slate-300 hover:text-indigo-600 transition-colors inline-block">
                                                                    <Download className="w-4 h-4" />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="py-20 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <FileText className="w-8 h-8 text-slate-200 mb-4" />
                                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">- No record found. -</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Notes' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setIsAddNoteOpen(!isAddNoteOpen)}
                                            className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform"
                                        >
                                            <Plus className={cn("w-5 h-5 transition-transform", isAddNoteOpen && "rotate-45")} />
                                            {isAddNoteOpen ? 'Close Form' : 'Add Note'}
                                        </button>
                                    </div>

                                    {isAddNoteOpen && (
                                        <form onSubmit={submitNote} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <textarea
                                                value={noteForm.data.detail}
                                                onChange={e => noteForm.setData('detail', e.target.value)}
                                                className="w-full rounded-2xl border-slate-100 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-medium p-6 min-h-[150px]"
                                                placeholder="Write your note detail here..."
                                                required
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={noteForm.processing}
                                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                                                >
                                                    Save Note
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="space-y-4">
                                        {deal.notes.length > 0 ? (
                                            deal.notes.map((note) => (
                                                <div key={note.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm group hover:border-indigo-100 transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <UserIcon className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Admin</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span className="text-[10px] font-bold text-slate-400">{new Date(note.created_at).toLocaleString()}</span>
                                                        </div>
                                                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{note.detail}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                                <StickyNote className="w-10 h-10 text-slate-200 mb-4" />
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">- No record found. -</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'History' && (
                                <div className="py-20 flex flex-col items-center">
                                    <History className="w-10 h-10 text-slate-100 mb-4" />
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">- Activity history is empty -</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Contact Detail */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden sticky top-6">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Lead Contact Detail</h3>
                        </div>
                        <div className="p-8 space-y-10">
                            <div className="space-y-8">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Contact</span>
                                    <span className="text-[13px] font-black text-indigo-600 hover:scale-[1.02] transition-transform origin-left cursor-pointer">{deal.lead?.name}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                    <span className="text-[13px] font-bold text-slate-600 truncate italic">{deal.lead?.email || '--'}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</span>
                                    <span className="text-[13px] font-bold text-slate-400">--</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</span>
                                    <span className="text-[13px] font-bold text-slate-400">--</span>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 active:scale-95 group/btn">
                                <Mail className="w-4 h-4 group-hover/btn:-rotate-12 transition-transform" />
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={isAddFollowUpOpen}
                onClose={() => {
                    if (followUpForm.processing) return;
                    setIsAddFollowUpOpen(false);
                    followUpForm.reset();
                }}
                maxWidth="2xl"
            >
                <form
                    onSubmit={submitFollowUp}
                    className="bg-white rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add Follow Up</h3>
                        <button
                            type="button"
                            onClick={() => {
                                if (followUpForm.processing) return;
                                setIsAddFollowUpOpen(false);
                                followUpForm.reset();
                            }}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6 items-center">
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Lead Name
                                </p>
                                <p className="text-[13px] font-semibold text-slate-800">
                                    {deal.lead?.name || '--'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Follow Up Next <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={followUpForm.data.next_follow_up_date}
                                    onChange={e =>
                                        followUpForm.setData('next_follow_up_date', e.target.value)
                                    }
                                    className="h-11 rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-semibold"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Start Time <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={followUpForm.data.start_time}
                                    onChange={e => followUpForm.setData('start_time', e.target.value)}
                                    className="h-11 rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-semibold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="send-reminder"
                                type="checkbox"
                                checked={followUpForm.data.send_reminder}
                                onChange={e => followUpForm.setData('send_reminder', e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="send-reminder"
                                className="text-[13px] font-medium text-slate-700 select-none"
                            >
                                Send Reminder
                            </label>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Remark
                            </label>
                            <textarea
                                value={followUpForm.data.remark}
                                onChange={e => followUpForm.setData('remark', e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-medium p-4 min-h-[100px]"
                                placeholder="Enter follow up notes..."
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Status
                            </label>
                            <select
                                value={followUpForm.data.status}
                                onChange={e => followUpForm.setData('status', e.target.value)}
                                className="h-11 rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-[13px] font-semibold"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-slate-50 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (followUpForm.processing) return;
                                setIsAddFollowUpOpen(false);
                                followUpForm.reset();
                            }}
                            className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={followUpForm.processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4358E4] text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Check className="w-4 h-4 stroke-[3px]" /> Save
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
