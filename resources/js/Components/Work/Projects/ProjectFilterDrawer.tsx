import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    filters: { search?: string; status?: string; category_id?: string; client_id?: string };
    clients: { id: number; name: string }[];
    categories: { id: number; name: string }[];
}

export default function ProjectFilterDrawer({ isOpen, onClose, filters, clients, categories }: Props) {
    const { data, setData, get, reset, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        category_id: filters.category_id || '',
        client_id: filters.client_id || '',
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('work.projects.index'), {
            preserveState: true,
            onSuccess: () => onClose(),
        });
    };

    const handleReset = () => {
        reset();
        get(route('work.projects.index'));
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    <span>Intelligence Filters</span>
                </div>
            }
            maxWidth="max-w-[450px]"
            footer={
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={processing}
                        className="flex-[2] px-6 py-3 bg-[#1d82f5] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1669c1] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                        Apply Filters
                    </button>
                </div>
            }
        >
            <form onSubmit={handleApply} className="space-y-8">
                {/* Search */}
                <div className="space-y-3">
                    <InputLabel value="Search by keyword" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest" />
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <TextInput
                            className="w-full pl-11 h-12 border-slate-200 bg-slate-50/50 rounded-xl shadow-none hover:bg-white focus:bg-white transition-all"
                            placeholder="Project name, code, etc..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                    <InputLabel value="Operational Status" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest" />
                    <select
                        className="w-full h-12 px-4 border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Finished">Finished</option>
                    </select>
                </div>

                {/* Category */}
                <div className="space-y-3">
                    <InputLabel value="Category" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest" />
                    <select
                        className="w-full h-12 px-4 border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Client */}
                <div className="space-y-3">
                    <InputLabel value="Client" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest" />
                    <select
                        className="w-full h-12 px-4 border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={data.client_id}
                        onChange={(e) => setData('client_id', e.target.value)}
                    >
                        <option value="">All Clients</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </form>
        </Drawer>
    );
}
