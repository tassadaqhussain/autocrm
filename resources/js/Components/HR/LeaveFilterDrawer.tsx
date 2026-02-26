import { useForm } from '@inertiajs/react';
import { Search, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import Drawer from '@/Components/Drawer';
import { cn } from '@/lib/utils';

interface LeaveFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSearch: string;
    currentStatus: string;
    currentType: string;
    leaveTypes: any[];
    onApply: (data: any) => void;
}

export default function LeaveFilterDrawer({
    isOpen,
    onClose,
    currentSearch,
    currentStatus,
    currentType,
    leaveTypes,
    onApply,
}: LeaveFilterDrawerProps) {
    const { data, setData } = useForm({
        search: currentSearch || '',
        status: currentStatus || 'All',
        type: currentType || 'All',
    });

    const handleApply = () => {
        onApply(data);
        onClose();
    };

    const handleReset = () => {
        const resetData = { search: '', status: 'All', type: 'All' };
        setData(resetData);
        onApply(resetData);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Leave Records"
            description="Refine time-off requests"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Search */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            Employee Name
                        </label>
                        <input
                            type="text"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder="Find requests..."
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Approval Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setData('status', s)}
                                    className={cn(
                                        'h-11 rounded-xl text-xs font-semibold border transition-all',
                                        data.status === s
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Leave Type */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-3 h-3 text-indigo-500" />
                            Leave Type
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full h-12 px-4 bg-slate-50 border-slate-200 rounded-xl text-[13px] font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Types</option>
                            {leaveTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
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
                        Clear
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-xs font items-center font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        Filter Results
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
