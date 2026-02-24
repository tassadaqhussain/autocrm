import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Search,
    Users,
    Instagram,
    Youtube,
    Twitter,
    Star,
    TrendingUp,
    MessageCircle,
    Copy,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Influencer {
    id: number;
    name: string;
    handle: string | null;
    platform: string | null;
    email: string | null;
    status: string;
    leads_count: number;
}

interface Props {
    influencers: Influencer[];
}

export default function InfluencersIndex({ influencers }: Props) {
    const [search, setSearch] = useState('');

    const filteredInfluencers = influencers.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.handle && i.handle.toLowerCase().includes(search.toLowerCase()))
    );

    const getPlatformIcon = (platform: string | null) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
            case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
            case 'tiktok': return <TrendingUp className="w-4 h-4 text-black" />; // simple fallback
            case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
            default: return <Users className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Influencer <span className="text-purple-600">Network</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Manage partners & affiliates</p>
                    </div>

                    <button className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-purple-200">
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>
            }
        >
            <Head title="Influencer Marketing" />

            <div className="mt-8 space-y-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search influencers by name or handle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredInfluencers.map((influencer) => (
                        <div key={influencer.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 relative">

                            {/* Header Gradient */}
                            <div className="h-24 bg-gradient-to-br from-purple-100 to-indigo-50 relative">
                                <span className={cn(
                                    "absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    influencer.status === 'Active' ? "bg-emerald-500 text-white" : "bg-slate-300 text-slate-700"
                                )}>
                                    {influencer.status}
                                </span>
                            </div>

                            {/* Avoid absolute centering for flex profile pic to ensure responsiveness */}
                            <div className="px-8 pt-0 pb-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shadow-purple-100/50 -mt-8 mb-4">
                                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl font-black uppercase">
                                        {influencer.name.charAt(0)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-xl font-black text-slate-900 leading-none truncate pr-2">{influencer.name}</h3>
                                    {getPlatformIcon(influencer.platform)}
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 tracking-widest">{influencer.handle || 'No Handle'}</p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-purple-50/50 p-3 rounded-xl">
                                        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Generated Leads</p>
                                        <p className="text-lg font-black text-purple-600">{influencer.leads_count}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mt-2 truncate">{influencer.platform || 'General'}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 py-3 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                        Profile
                                    </button>
                                    <button className="p-3 border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors group/btn">
                                        <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-300 min-h-[350px]">
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-purple-600 shadow-sm transition-all shadow-purple-100">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-sm font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tight block">Add Partner</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2 block">Grow your network</span>
                        </div>
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
