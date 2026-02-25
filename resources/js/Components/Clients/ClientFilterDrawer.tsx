import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Drawer from '@/Components/Drawer';
import InputLabel from '@/Components/InputLabel';
import { cn } from '@/lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    currentStatus: string;
    perPage: number;
    onApply: (search: string, status: string) => void;
}

export default function ClientFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    currentStatus,
    perPage,
    onApply,
}: Props) {
    const [search, setSearch] = useState(currentSearch);
    const [status, setStatus] = useState(currentStatus);

    useEffect(() => {
        if (isOpen) {
            setSearch(currentSearch);
            setStatus(currentStatus);
        }
    }, [isOpen, currentSearch, currentStatus]);

    const handleApply = () => {
        onApply(search, status);
        onClose();
    };

    const handleClear = () => {
        setSearch('');
        setStatus('All');
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Search & filter"
            description="Find clients by name, email, mobile or status."
            maxWidth="max-w-md"
            footer={
                <div className="flex items-center justify-between w-full">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-5 py-2.5 text-slate-500 text-[13px] font-semibold hover:text-slate-700 transition-colors"
                    >
                        Clear
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-transparent text-slate-400 text-[13px] font-semibold hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4358E4] text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            Apply filters
                        </button>
                    </div>
                </div>
            }
        >
            <div className="space-y-8">
                <div className="space-y-2">
                    <InputLabel className="text-[13px] text-slate-600 font-medium">Search</InputLabel>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                            placeholder="Name, email or mobile..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <InputLabel className="text-[13px] text-slate-600 font-medium">Status</InputLabel>
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={cn(
                                'w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700',
                                'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none cursor-pointer'
                            )}
                        >
                            <option value="All">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {(search || (status !== 'All')) && (
                    <p className="text-[12px] text-slate-500">
                        {search && `Search: "${search}"`}
                        {search && status !== 'All' && ' · '}
                        {status !== 'All' && `Status: ${status}`}
                    </p>
                )}
            </div>
        </Drawer>
    );
}
