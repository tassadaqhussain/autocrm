import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Plus, Command, Calendar, User, LayoutGrid, CheckCircle2 } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Task {
    id: number;
    heading: string;
    description: string;
    project?: { project_name: string };
    users?: { name: string }[];
    due_date: string;
    priority: string;
    status: string;
}

interface Props {
    tasks: Task[];
}

const PRIORITY_CONFIG: Record<string, string> = {
    'Urgent': 'text-rose-600 bg-rose-50 border-rose-100',
    'High': 'text-orange-600 bg-orange-50 border-orange-100',
    'Medium': 'text-indigo-600 bg-indigo-50 border-indigo-100',
    'Low': 'text-slate-500 bg-slate-50 border-slate-100',
};

const STATUS_CONFIG: Record<string, string> = {
    'Completed': 'text-emerald-600 bg-emerald-50 fill-emerald-600',
    'Incomplete': 'text-slate-400 bg-slate-50 fill-none',
    'Doing': 'text-blue-600 bg-blue-50 fill-blue-600',
};

export default function Index({ tasks }: Props) {
    const columns: DataTableColumn<Task>[] = useMemo(() => [
        {
            id: 'task',
            header: 'Objective',
            cell: (t) => (
                <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-[1.1rem] flex items-center justify-center transition-all", t.status === 'Completed' ? "bg-emerald-50 text-emerald-500 shadow-sm" : "bg-slate-50 text-slate-400")}>
                        <CheckCircle2 className={cn("w-5 h-5", t.status === 'Completed' && "fill-emerald-50")} />
                    </div>
                    <div>
                        <p className={cn("font-bold text-[14px] uppercase tracking-tight italic", t.status === 'Completed' ? "text-slate-400 line-through decoration-emerald-500/30 decoration-2" : "text-slate-900")}>{t.heading}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t.project?.project_name || 'Individual Task'}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'assignee',
            header: 'Operational Unit',
            cell: (t) => (
                <div className="flex -space-x-3">
                    {(t.users?.length ?? 0) > 0 ? t.users?.map((u, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform">
                            {u.name.charAt(0)}
                        </div>
                    )) : (
                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 border-2 border-slate-100 flex items-center justify-center text-[10px] font-black shadow-sm italic">
                            ?
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'priority',
            header: 'Criticality',
            cell: (t) => (
                <span className={cn("px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm", PRIORITY_CONFIG[t.priority] || 'text-slate-500 bg-slate-50 border-slate-100')}>
                    {t.priority}
                </span>
            )
        },
        {
            id: 'timeline',
            header: 'Target Date',
            cell: (t) => (
                <div className="flex items-center gap-2 text-slate-900 font-bold text-[11px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.due_date || 'ASAP'}</span>
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
                            Operational Tasks
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{tasks.length} Active System Objectives</p>
                    </div>
                    <button className="h-12 px-8 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 group">
                        <Command className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Assign Task
                    </button>
                </div>
            }
        >
            <Head title="Work | Task Management" />

            <div className="max-w-[1600px] mx-auto py-10">
                <DataTable
                    columns={columns}
                    data={tasks}
                    getRowId={(t) => t.id}
                    emptyMessage="No operational objectives in the pipeline."
                />
            </div>
        </AuthenticatedLayout>
    );
}
