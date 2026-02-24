import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Zap,
    Target,
    Activity,
    Users,
    ChevronRight,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Clock,
    Megaphone,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';

interface Campaign {
    id: number;
    name: string;
    type: string;
    channel: string;
    objective: string;
    budget: number;
    budget_type: string;
    status: string;
    starts_at: string;
    ends_at: string;
    manager?: {
        name: string;
    };
    leads_count?: number;
}

interface Props {
    campaigns: Campaign[];
}

export default function CampaignsIndex({ campaigns }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Paused': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Draft': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Marketing <span className="text-orange-500">Campaigns</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Manage & Optimize your ad campaigns</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('marketing.campaigns.builder')}
                            className="px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Zap className="w-4 h-4 text-orange-500" /> AI Campaign Builder
                        </Link>
                        <Link
                            href={route('marketing.campaigns.create')}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                        >
                            <Plus className="w-4 h-4" /> New Campaign
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Marketing Campaigns" />

            <div className="mt-8 space-y-8">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['All', 'Active', 'Paused', 'Completed', 'Draft'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    statusFilter === status
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white text-slate-400 border border-slate-100 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col">
                            {/* Card Header */}
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        getStatusColor(campaign.status)
                                    )}>
                                        {campaign.status}
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <Link
                                    href={route('marketing.campaigns.show', campaign.id)}
                                    className="group/title"
                                >
                                    <h3 className="text-xl font-black text-slate-900 uppercase leading-tight group-hover/title:text-indigo-600 transition-colors">{campaign.name}</h3>
                                </Link>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {campaign.starts_at ? format(new Date(campaign.starts_at), 'MMM dd, yyyy') : 'No start date'}
                                </p>
                            </div>

                            {/* Card Stats */}
                            <div className="px-8 grid grid-cols-2 gap-4 my-6">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                                    <p className="text-sm font-black text-slate-900 italic">SAR {campaign.budget}</p>
                                </div>
                                <div className="bg-indigo-50/30 p-4 rounded-2xl">
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Leads</p>
                                    <p className="text-sm font-black text-indigo-600 italic">{campaign.leads_count ?? 0}</p>
                                </div>
                            </div>

                            {/* Card Features */}
                            <div className="px-8 flex flex-wrap gap-2 mb-8">
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{campaign.channel}</span>
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{campaign.type}</span>
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest truncate max-w-[120px]">{campaign.objective}</span>
                            </div>

                            {/* Card Footer */}
                            <div className="mt-auto border-t border-slate-50 p-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] uppercase font-black">
                                        {campaign.manager?.name.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Manager</p>
                                        <p className="text-[10px] font-black text-slate-900 uppercase mt-1 leading-none">{campaign.manager?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('marketing.campaigns.show', campaign.id)}
                                    className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group/arrow"
                                >
                                    <ArrowUpRight className="w-5 h-5 group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Create New Placeholder */}
                    <Link
                        href={route('marketing.campaigns.create')}
                        className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 group hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-500"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-white group-hover:text-orange-500 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-100">
                            <Plus className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tight transition-colors">Launch New Campaign</h3>
                            <p className="text-[10px] text-slate-300 group-hover:text-slate-500 font-black uppercase tracking-widest mt-1 italic">Reach more patients today</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
