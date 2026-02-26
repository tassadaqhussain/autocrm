import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Plus, Clock, User, Calendar, Play, Watch } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Timesheet {
    id: number;
    task?: { heading: string };
    user?: { name: string };
    start_time: string;
    end_time: string | null;
    total_hours: number;
    memo: string;
}

interface Props {
    timesheets: Timesheet[];
}

export default function Index({ timesheets }: Props) {
    const columns: DataTableColumn<Timesheet>[] = useMemo(() => [
        {
            id: 'unit',
            header: 'Personnel',
            cell: (t) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-[12px] font-black uppercase shadow-lg shadow-slate-200">
                        {t.user?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-[14px] uppercase tracking-tight italic leading-none">{t.user?.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Registered Active
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'objective',
            header: 'Active Task',
            cell: (t) => (
                <div>
                    <p className="text-[13px] font-black text-slate-700 uppercase tracking-tight italic">{t.task?.heading || 'Standalone Operational Work'}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate max-w-xs">{t.memo || 'Regular system maintenance'}</p>
                </div>
            )
        },
        {
            id: 'duration',
            header: 'Precision Time',
            cell: (t) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
                        <Watch className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[18px] font-black text-slate-900 tabular-nums tracking-tighter leading-none">{Number(t.total_hours).toFixed(2)}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Logged Hours</p>
                    </div>
                </div>
            )
        },
        {
            id: 'log',
            header: 'Execution Timestamp',
            cell: (t) => (
                <div className="flex items-center gap-2 text-slate-900 font-bold text-[11px] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(t.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            )
        },
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            Operational Timesheet
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{timesheets.length} Quantified Labor Units Verified Today</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-12 px-8 border-2 border-slate-900 bg-white text-slate-900 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95">
                            <Play className="w-4 h-4 fill-slate-900" /> Start Timer
                        </button>
                        <button className="h-12 px-8 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Log Hours
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Work | Temporal Intelligence" />

            <div className="max-w-[1600px] mx-auto py-10">
                <DataTable
                    columns={columns}
                    data={timesheets}
                    getRowId={(t) => t.id}
                    emptyMessage="No time logs registered for this session."
                />
            </div>
        </AuthenticatedLayout>
    );
}
