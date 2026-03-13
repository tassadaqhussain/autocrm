import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import { Plus, FileText, User, Calendar, CreditCard, Layers, Download } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateContractDrawer from '@/Components/Work/Contracts/CreateContractDrawer';

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

interface Client {
    id: number;
    name: string;
}

interface ContractType {
    id: number;
    name: string;
}

interface Props {
    contracts: Contract[];
    clients: Client[];
    projects: { id: number; project_name: string }[];
    contractTypes: ContractType[];
}

const STATUS_CONFIG: Record<string, string> = {
    'Draft': 'bg-slate-100 text-slate-600',
    'Signed': 'bg-emerald-100 text-emerald-600',
    'Canceled': 'bg-rose-100 text-rose-600',
};

export default function Index({ contracts, clients, projects, contractTypes }: Props) {
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

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
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCreateDrawerOpen(true)} className="h-10 px-4 bg-[#1d82f5] text-white rounded text-sm font-medium hover:bg-[#1669c1] transition-colors flex items-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4 flex-shrink-0" /> Create Contract
                        </button>
                        <Link href={route('work.contracts.templates')} className="h-10 px-4 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                            <Layers className="w-4 h-4 flex-shrink-0" /> Contract Template
                        </Link>
                        <button className="h-10 px-4 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                            <Download className="w-4 h-4 flex-shrink-0" /> Export
                        </button>
                    </div>
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

            <CreateContractDrawer
                isOpen={createDrawerOpen}
                onClose={() => setCreateDrawerOpen(false)}
                clients={clients}
                projects={projects}
                contractTypes={contractTypes}
            />
        </AuthenticatedLayout>
    );
}
