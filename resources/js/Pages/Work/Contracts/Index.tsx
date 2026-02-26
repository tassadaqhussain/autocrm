import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Plus, FileText, User, Calendar, CreditCard } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Contract {
    id: number;
    subject: string;
    description: string;
    client?: { name: string };
    amount: number;
    start_date: string;
    end_date: string;
    status: string;
}

interface Props {
    contracts: Contract[];
}

const STATUS_CONFIG: Record<string, string> = {
    'Draft': 'bg-slate-100 text-slate-600',
    'Signed': 'bg-emerald-100 text-emerald-600',
    'Canceled': 'bg-rose-100 text-rose-600',
};

export default function Index({ contracts }: Props) {
    const columns: DataTableColumn<Contract>[] = useMemo(() => [
        {
            id: 'contract',
            header: 'Agreement',
            cell: (c) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-[14px] uppercase tracking-tight italic">{c.subject}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{c.client?.name || 'Main Clinic Agreement'}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'valuation',
            header: 'Valuation',
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[14px] font-black text-slate-900 tabular-nums tracking-tighter">SAR {Number(c.amount).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Contract Value</p>
                    </div>
                </div>
            )
        },
        {
            id: 'period',
            header: 'Service Period',
            cell: (c) => (
                <div className="flex items-center gap-2 text-slate-600 font-bold text-[11px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.start_date || 'N/A'}</span>
                    <span className="mx-2 text-slate-300">→</span>
                    <span>{c.end_date || 'N/A'}</span>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Governance',
            cell: (c) => (
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-inset", STATUS_CONFIG[c.status] || 'bg-slate-100 ring-slate-200')}>
                    {c.status}
                </span>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            Legal Contracts
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{contracts.length} Legally Binding Service Agreements</p>
                    </div>
                    <button className="h-12 px-8 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Draft Contract
                    </button>
                </div>
            }
        >
            <Head title="Work | Legal Portfolio" />

            <div className="max-w-[1600px] mx-auto py-10">
                <DataTable
                    columns={columns}
                    data={contracts}
                    getRowId={(c) => c.id}
                    emptyMessage="No legal service agreements found."
                />
            </div>
        </AuthenticatedLayout>
    );
}
