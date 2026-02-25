import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Plus,
    ChevronRight,
    Phone,
    Calendar,
    Target,
    Zap,
    LayoutList,
    Columns,
    MoreHorizontal,
    Contact,
    Handshake,
    MessageSquare,
    AlertCircle,
    Scale,
    UserCircle,
    Copy,
    ExternalLink,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Drawer from '@/Components/Drawer';
import CreateLeadDrawer from '@/Components/Leads/CreateLeadDrawer';
import { useEffect } from 'react';

interface Campaign {
    id: number;
    name: string;
}

interface Counselor {
    id: number;
    name: string;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    bmi: number;
    urgency: string;
    health_info: string;
    campaign?: {
        name: string;
    };
    counselor?: {
        name: string;
    };
    created_at: string;
}

interface Props {
    leads: Lead[];
    campaigns: Campaign[];
    counselors: Counselor[];
}

export default function Index({ leads, campaigns, counselors }: Props) {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === 'true') {
            setIsCreateModalOpen(true);
            // Optionally clear the param to avoid re-opening on manual refresh after closing
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[?&]create=true/, ''));
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">
                            Patient Leads
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">Manage and track your clinic's potential patient pipeline.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
                            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-lg">
                                <LayoutList className="w-5 h-5" />
                            </div>
                            <Link
                                href={route('leads.index', { view: 'pipeline' })}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <Columns className="w-5 h-5" />
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Leads Management" />

            <div className="space-y-8 pb-12">
                {/* Search and Filters */}
                <div className="bg-white p-6 border border-slate-100 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, phone or source..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-sm transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                        <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                            <Calendar className="w-4 h-4" /> Date Range
                        </button>
                    </div>
                </div>

                {/* Leads Table Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.15em] text-slate-400">
                                    <th className="px-8 py-5">Patient Details</th>
                                    <th className="px-8 py-5">Journey Status</th>
                                    <th className="px-8 py-5">Lead Origin</th>
                                    <th className="px-8 py-5">Quality Score</th>
                                    <th className="px-8 py-5 text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="group hover:bg-slate-50/50 transition-all duration-300 cursor-pointer"
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{lead.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 group-hover:text-slate-600 transition-colors">{lead.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", getStatusPulseColor(lead.status))}></div>
                                                <span className={cn(
                                                    "px-3 py-1 text-[10px] rounded-lg font-black uppercase tracking-widest border",
                                                    getStatusStyles(lead.status)
                                                )}>
                                                    {lead.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors capitalize">{lead.source}</span>
                                                <span className="text-[10px] text-slate-400 font-bold truncate max-w-[150px] uppercase mt-0.5">{lead.campaign?.name || 'Manual'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(79,70,229,0.4)]", getScoreColor(lead.score))}
                                                        style={{ width: `${lead.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className={cn("text-xs font-black", getScoreText(lead.score))}>{lead.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                                                    <Search className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No patient records found</h3>
                                                <p className="text-xs text-slate-500 font-medium mt-1">Sync your marketing campaigns or add leads manually.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick View Drawer */}
            <Drawer
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Lead Perspective"
                description={`Reference ID: #L-00${selectedLead?.id}`}
                maxWidth="max-w-2xl"
                footer={
                    <div className="flex items-center justify-between w-full">
                        <button
                            onClick={() => selectedLead && router.get(route('leads.show', selectedLead.id))}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Full Workspace <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all">
                                <Phone className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                }
            >
                {selectedLead && (
                    <div className="space-y-10">
                        {/* Profile Header */}
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-3xl text-slate-400 shadow-inner">
                                {selectedLead.name.charAt(0)}
                            </div>
                            <div className="flex-1 pt-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{selectedLead.name}</h3>
                                    <span className={cn(
                                        "px-2.5 py-1 text-[9px] rounded-lg font-black uppercase tracking-widest border",
                                        getStatusStyles(selectedLead.status)
                                    )}>
                                        {selectedLead.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 group cursor-pointer">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{selectedLead.phone}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500">Registered {new Date(selectedLead.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Quality Index</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">{selectedLead.score}</span>
                                    <Zap className={cn("w-4 h-4 mb-2", selectedLead.score >= 70 ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Clinical BMI</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">{selectedLead.bmi || '--'}</span>
                                    <Scale className="w-4 h-4 mb-2 text-slate-300" />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Response Prio</span>
                                <div className="flex items-end gap-2">
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-wider mb-0.5",
                                        selectedLead.urgency === 'High' ? "text-rose-500" : "text-amber-500"
                                    )}>{selectedLead.urgency}</span>
                                    <AlertCircle className={cn("w-4 h-4 mb-2", selectedLead.urgency === 'High' ? "text-rose-500" : "text-amber-500")} />
                                </div>
                            </div>
                        </div>

                        {/* Attribution Sect */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-slate-900" />
                                <h4 className="text-[11px] font-black black text-slate-900 uppercase tracking-widest">Attribution & Source</h4>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                                <div className="px-6 py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Primary Source</span>
                                        <span className="text-xs font-bold text-slate-900">{selectedLead.source}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Campaign</span>
                                        <span className="text-xs font-bold text-indigo-600">{selectedLead.campaign?.name || 'Manual Admisson'}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assigned Counselor</span>
                                        <span className="text-xs font-bold text-slate-900">{selectedLead.counselor?.name || 'Unassigned / Round Robin'}</span>
                                    </div>
                                    <UserCircle className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        {/* Case Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-slate-900" />
                                <h4 className="text-[11px] font-black black text-slate-900 uppercase tracking-widest">Clinical Background</h4>
                            </div>
                            <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100/50">
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                    {selectedLead.health_info ? `"${selectedLead.health_info}"` : "No specific health background or consultation notes were provided for this record yet."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            <CreateLeadDrawer
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                campaigns={campaigns}
                counselors={counselors}
            />
        </AuthenticatedLayout>
    );
}

function getStatusPulseColor(status: string) {
    switch (status) {
        case 'New': return 'bg-blue-400 animate-pulse';
        case 'Contacted': return 'bg-amber-400';
        case 'Appointment Scheduled': return 'bg-indigo-400';
        case 'Consultation Done': return 'bg-emerald-400';
        default: return 'bg-slate-300';
    }
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'New': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Appointment Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'Consultation Done': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Lost': return 'bg-slate-50 text-slate-500 border-slate-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
}

function getScoreColor(score: number) {
    if (score >= 80) return 'bg-rose-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-blue-500';
}

function getScoreText(score: number) {
    if (score >= 80) return 'text-rose-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-blue-600';
}
