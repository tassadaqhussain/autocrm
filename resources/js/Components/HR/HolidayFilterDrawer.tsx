import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import Drawer from '@/Components/Drawer';

interface HolidayFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    onApply: (data: any) => void;
}

export default function HolidayFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    onApply,
}: HolidayFilterDrawerProps) {
    const { data, setData } = useForm({
        search: currentSearch || '',
    });

    const handleApply = () => {
        onApply(data);
        onClose();
    };

    const handleReset = () => {
        const resetData = { search: '' };
        setData(resetData);
        onApply(resetData);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Holidays"
            description="Find scheduled public holidays"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            Holiday Name
                        </label>
                        <input
                            type="text"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder="e.g. Christmas, New Year..."
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="p-6 border-t bg-slate-50/50 flex gap-3 mt-auto">
                    <button onClick={handleReset} className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors bg-white border border-slate-200">
                        Clear
                    </button>
                    <button onClick={handleApply} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
                        Apply Filter
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
