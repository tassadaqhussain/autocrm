import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Facebook,
    Instagram,
    Globe,
    Smartphone,
    MessageCircle,
    CheckCircle2,
    XCircle,
    Calendar,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Campaign {
    id: number;
    name: string;
    type: string;
    objective: string;
    status: string;
    budget: number;
    budget_type: string;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

interface Props {
    campaigns: Campaign[];
}

export default function Index({ campaigns }: Props) {
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);

    const platforms = [
        { id: 'meta', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
        { id: 'google', name: 'Google', icon: Globe, color: 'text-rose-500' },
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
        { id: 'tiktok', name: 'Tiktok', icon: Smartphone, color: 'text-slate-900' },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500' },
    ];

    const getPlatformIcon = (type: string) => {
        const p = platforms.find(p => p.id === type.toLowerCase());
        if (!p) return <Globe className="w-4 h-4 text-slate-400" />;
        return <p.icon className={cn("w-4 h-4", p.color)} />;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Marketing Ads
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">Manage and track your performance marketing campaigns.</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                        >
                            <Plus className="w-4 h-4" /> Create
                        </button>

                        {showCreateDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowCreateDropdown(false)} />
                                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-50 p-3 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                                    <p className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Select Platform</p>
                                    {platforms.map(p => (
                                        <Link
                                            key={p.id}
                                            href={route('campaigns.builder', { platform: p.id })}
                                            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs text-slate-900 uppercase tracking-tight group"
                                        >
                                            <p.icon className={cn("w-5 h-5", p.color, "group-hover:scale-110 transition-transform")} />
                                            {p.name}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Campaigns" />

            <div className="space-y-8 pb-12">
                {/* Filters Row */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-8 border-b border-slate-100">
                        {['All Ads', 'Active', 'Inactive'].map((tab, i) => (
                            <button
                                key={tab}
                                className={cn(
                                    "pb-4 px-1 text-[11px] font-black uppercase tracking-widest transition-all relative",
                                    i === 0 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab}
                                {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                className="pl-11 pr-5 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold w-64 focus:ring-4 focus:ring-slate-50 focus:border-slate-900 transition-all"
                            />
                        </div>
                        <button className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                            Duration <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                            Channels <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden border-t-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.15em] text-slate-400 border-b border-slate-100">
                                <th className="px-10 py-6">Ad Name</th>
                                <th className="px-10 py-6">Channels</th>
                                <th className="px-10 py-6">Click</th>
                                <th className="px-10 py-6">Impression</th>
                                <th className="px-10 py-6">Reach</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Registered</th>
                                <th className="px-10 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {campaigns.map((camp) => (
                                <tr
                                    key={camp.id}
                                    onClick={() => router.get(route('campaigns.show', camp.id))}
                                    className="group hover:bg-slate-50/30 transition-all cursor-pointer"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{camp.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{camp.objective}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                {getPlatformIcon(camp.type)}
                                            </div>
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{camp.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-sm font-black tabular-nums text-slate-900">{Math.floor(Math.random() * 1000)}</td>
                                    <td className="px-10 py-8 text-sm font-black tabular-nums text-slate-900">{Math.floor(Math.random() * 5000)}</td>
                                    <td className="px-10 py-8 text-sm font-black tabular-nums text-slate-900">{Math.floor(Math.random() * 3000)}</td>
                                    <td className="px-10 py-8">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest",
                                            camp.status === 'Active' || camp.status === 'Launched'
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-slate-50 text-slate-400 border-slate-200"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", camp.status === 'Active' || camp.status === 'Launched' ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                            {camp.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 uppercase">
                                                {new Date(camp.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                {new Date(camp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {campaigns.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center">
                                                <Smartphone className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No active campaigns</h3>
                                            <p className="text-xs text-slate-500 font-medium">Create your first ad to start tracking performance.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
