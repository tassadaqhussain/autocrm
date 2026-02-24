import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Search,
    Image as ImageIcon,
    Video,
    Type,
    Layers,
    Download,
    Eye,
    MoreVertical,
    Folder
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Creative {
    id: number;
    name: string;
    type: string;
    url: string;
    thumbnail_url: string | null;
    status: string;
}

interface Props {
    creatives: Creative[];
}

export default function CreativesIndex({ creatives }: Props) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const filteredCreatives = creatives.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All' || c.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
            case 'video': return <Video className="w-5 h-5 text-indigo-500" />;
            case 'carousel': return <Layers className="w-5 h-5 text-orange-500" />;
            case 'text': return <Type className="w-5 h-5 text-slate-500" />;
            default: return <Folder className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Media <span className="text-indigo-600">Library</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Manage ad assets & creatives</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Folder className="w-4 h-4 text-slate-400" /> New Folder
                        </button>
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                            <Plus className="w-4 h-4" /> Upload Media
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Media Library" />

            <div className="mt-8 space-y-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search creatives..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['All', 'Image', 'Video', 'Carousel', 'Text'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    typeFilter === type
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white text-slate-400 border border-slate-100 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCreatives.map((creative) => (
                        <div key={creative.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                {creative.thumbnail_url ? (
                                    <img src={creative.thumbnail_url} alt={creative.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        {getTypeIcon(creative.type)}
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <button className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className={cn(
                                    "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest z-10",
                                    creative.status === 'Active' ? "bg-emerald-500 text-white" : "bg-slate-900/80 text-white backdrop-blur-md"
                                )}>
                                    {creative.type}
                                </div>
                            </div>

                            <div className="p-5 flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate w-full" title={creative.name}>
                                        {creative.name}
                                    </h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {creative.status}
                                    </p>
                                </div>
                                <button className="text-slate-300 hover:text-slate-900 transition-colors pt-1 shrink-0">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 min-h-[250px] aspect-square">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 shadow-sm transition-all shadow-slate-200">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tight">Upload New</span>
                    </button>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
