import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Plus, HelpCircle, Layers, FileText } from 'lucide-react';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { useMemo, useState } from 'react';
import CreateContractTemplateDrawer from '@/Components/Work/Contracts/CreateContractTemplateDrawer';

interface Template {
    id: number;
    subject: string;
    amount: number;
}

interface ContractType {
    id: number;
    name: string;
}

interface Props {
    templates: Template[];
    contractTypes: ContractType[];
}

export default function Templates({ templates, contractTypes }: Props) {
    const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);

    const columns: DataTableColumn<Template>[] = useMemo(() => [
        {
            id: 'subject',
            header: 'Subject',
            cell: (t) => (
                <div className="text-sm text-slate-700">
                    {t.subject}
                </div>
            )
        },
        {
            id: 'amount',
            header: 'Amount',
            cell: (t) => (
                <div className="text-sm text-slate-700">
                    {t.amount ? `SAR ${Number(t.amount).toLocaleString()}` : '--'}
                </div>
            )
        },
        {
            id: 'action',
            header: 'Action',
            cell: () => (
                <div className="flex items-center gap-2 text-slate-400">
                    --
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            Contract Templates
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{templates.length} Saved Templates</p>
                    </div>
                </div>
            }
        >
            <Head title="Work | Contract Templates" />

            <div className="max-w-[1600px] mx-auto py-10">
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <button
                        onClick={() => setTemplateDrawerOpen(true)}
                        className="h-10 px-4 bg-black text-white rounded text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4 flex-shrink-0" /> Add Contract Template
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={templates}
                    getRowId={(t) => t.id}
                    emptyMessage="No data available in table"
                />
            </div>

            <CreateContractTemplateDrawer
                isOpen={templateDrawerOpen}
                onClose={() => setTemplateDrawerOpen(false)}
                contractTypes={contractTypes}
            />
        </AuthenticatedLayout>
    );
}
