import { useForm } from '@inertiajs/react';
import { Search, Award, Calendar } from 'lucide-react';
import Drawer from '@/Components/Drawer';
import { cn } from '@/lib/utils';

interface AppreciationFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    currentAward: string;
    awards: any[];
    onApply: (data: any) => void;
}

export default function AppreciationFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    currentAward,
    awards,
    onApply,
}: AppreciationFilterDrawerProps) {
    const { data, setData } = useForm({
        search: currentSearch || '',
        award: currentAward || 'All',
    });

    const handleApply = () => {
        onApply(data);
        onClose();
    };

    const handleReset = () => {
        const resetData = { search: '', award: 'All' };
        setData(resetData);
        onApply(resetData);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Appreciations"
            description="Locate specific recognitions"
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
                            placeholder="Recipient name..."
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Award Type */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-3 h-3 text-amber-500" />
                            Honorary Award
                        </label>
                        <select
                            value={data.award}
                            onChange={(e) => setData('award', e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Awards</option>
                            {awards.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.title}
                                </option>
                            ))}
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
                        Apply Filters
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
