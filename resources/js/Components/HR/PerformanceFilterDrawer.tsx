import { useForm } from '@inertiajs/react';
import { Search, Star, Layers, Calendar } from 'lucide-react';
import Drawer from '@/Components/Drawer';
import { cn } from '@/lib/utils';

interface PerformanceFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    currentRating: string;
    currentCategory: string;
    employees: any[];
    onApply: (data: any) => void;
}

export default function PerformanceFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    currentRating,
    currentCategory,
    onApply,
}: PerformanceFilterDrawerProps) {
    const { data, setData } = useForm({
        search: currentSearch || '',
        rating: currentRating || 'All',
        category: currentCategory || 'All',
    });

    const handleApply = () => {
        onApply(data);
        onClose();
    };

    const handleReset = () => {
        const resetData = { search: '', rating: 'All', category: 'All' };
        setData(resetData);
        onApply(resetData);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Insights"
            description="Refine performance records"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Search */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            Employee Search
                        </label>
                        <input
                            type="text"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder="Find evaluations..."
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Rating */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-3 h-3 text-amber-500" />
                            Rating Tier
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['All', '1', '2', '3', '4', '5'].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setData('rating', star)}
                                    className={cn(
                                        'h-11 rounded-xl text-xs font-semibold border transition-all',
                                        data.rating === star
                                            ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200 hover:bg-amber-50/10'
                                    )}
                                >
                                    {star === 'All' ? 'All' : `${star} Stars`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-3 h-3 text-indigo-500" />
                            Evaluation Category
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Categories</option>
                            <option value="General">General</option>
                            <option value="Technical">Technical</option>
                            <option value="Soft Skills">Soft Skills</option>
                            <option value="Leadership">Leadership</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-slate-50/50 flex gap-3 mt-auto">
                    <button
                        onClick={handleReset}
                        className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors bg-white border border-slate-200"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        Refine Archive
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
