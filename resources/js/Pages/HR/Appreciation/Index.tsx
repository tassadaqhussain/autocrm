import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Award, Plus, Edit2, Trash2, Calendar, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import CreateAppreciationDrawer from '@/Components/HR/CreateAppreciationDrawer';
import AppreciationFilterDrawer from '@/Components/HR/AppreciationFilterDrawer';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    appreciations: any[];
    employees: any[];
    awards: any[];
    filters: any;
}

export default function Index({ appreciations, employees, awards, filters }: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [selectedAppreciation, setSelectedAppreciation] = useState<any>(null);

    const openCreate = () => {
        setSelectedAppreciation(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (appr: any) => {
        setSelectedAppreciation(appr);
        setIsDrawerOpen(true);
    };

    const handleApplyFilters = (newFilters: any) => {
        router.get(route('hr.appreciations.index'), {
            ...newFilters,
            search: newFilters.search || undefined,
            award: newFilters.award !== 'All' ? newFilters.award : undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this appreciation record?')) {
            router.delete(route('hr.appreciations.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'award',
            header: 'Award',
            cell: (appr) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        <Award className="w-5 h-5" style={{ color: appr.award?.color }} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{appr.award?.title || 'General'}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Honorary Mention</p>
                    </div>
                </div>
            )
        },
        {
            id: 'recognition',
            header: 'Recognition Details',
            cell: (appr) => (
                <div className="max-w-md">
                    <p className="text-[13px] font-bold text-slate-900">{appr.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{appr.description}</p>
                </div>
            )
        },
        {
            id: 'recipient',
            header: 'Employee',
            cell: (appr) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-[11px]">
                        {appr.employee?.user?.name?.charAt(0)}
                    </div>
                    <p className="text-[13px] font-medium text-slate-700">{appr.employee?.user?.name}</p>
                </div>
            )
        },
        {
            id: 'date',
            header: 'Achievement Date',
            cell: (appr) => (
                <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(appr.given_date)}</span>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Appreciations</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{appreciations.length} total records</span>
                    </div>
                    <button
                        onClick={openCreate}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Appreciation
                    </button>
                </div>
            }
        >
            <Head title="Appreciations" />

            <div className="max-w-[1600px] mx-auto py-8 space-y-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        Refine
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={appreciations}
                    getRowId={(appr) => appr.id}
                    renderActions={(appr) => (
                        <div className="flex justify-end gap-1 items-center">
                            <button
                                onClick={() => openEdit(appr)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors border border-slate-200"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(appr.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors border border-slate-200"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    emptyMessage="No appreciation records found."
                />

                <CreateAppreciationDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => { setIsDrawerOpen(false); setSelectedAppreciation(null); }}
                    employees={employees}
                    initialAwards={awards}
                    appreciation={selectedAppreciation}
                />

                <AppreciationFilterDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                    currentSearch={filters?.search || ''}
                    currentAward={filters?.award || 'All'}
                    awards={awards}
                    onApply={handleApplyFilters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
