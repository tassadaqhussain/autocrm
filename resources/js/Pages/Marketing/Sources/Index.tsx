import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Target,
    Zap,
    Users,
    Activity,
    Plus,
    Filter,
    MoreHorizontal,
    QrCode,
    Smartphone,
    Mail,
    Globe,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Source {
    id: number;
    name: string;
    channel: string;
    tracking_number: string | null;
    is_active: boolean;
}

interface Props {
    sources: Source[];
}

export default function SourcesIndex({ sources }: Props) {
    const [search, setSearch] = useState('');

    const filteredSources = sources.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const getIconForChannel = (channel: string) => {
        switch (channel?.toLowerCase()) {
            case 'digital': return <Globe className="w-5 h-5 text-blue-500" />;
            case 'social': return <Users className="w-5 h-5 text-indigo-500" />;
            case 'messaging': return <Smartphone className="w-5 h-5 text-emerald-500" />;
            default: return <Target className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Lead <span className="text-indigo-600">Sources</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Manage attribution origins & tracking</p>
                    </div>

                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                        <Plus className="w-4 h-4" /> Add Source
                    </button>
                </div>
            }
        >
            <Head title="Lead Sources" />

            <div className="mt-8 space-y-8">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search sources..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSources.map((source) => (
                        <div key={source.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-8 group hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                    {getIconForChannel(source.channel)}
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    source.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                )}>
                                    {source.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{source.name}</h3>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{source.channel}</span>
                            </div>

                            {source.tracking_number && (
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tracking Number</span>
                                    <span className="text-xs font-bold text-slate-900">{source.tracking_number}</span>
                                </div>
                            )}

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 py-2 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
                                    Edit
                                </button>
                                <button className="p-2 border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors">
                                    <QrCode className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 min-h-[250px]">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-500 shadow-sm transition-all">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tight">Add Lead Source</span>
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
