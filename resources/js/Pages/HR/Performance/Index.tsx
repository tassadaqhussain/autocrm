import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, TrendingUp, Calendar, Filter, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import CreatePerformanceDrawer from '@/Components/HR/CreatePerformanceDrawer';
import PerformanceFilterDrawer from '@/Components/HR/PerformanceFilterDrawer';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    reviews: any[];
    employees: any[];
    stats: any;
    filters: any;
}

const RATING_LABELS: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: 'Unsatisfactory', color: 'text-rose-600', bg: 'bg-rose-100' },
    2: { label: 'Needs Improvement', color: 'text-orange-600', bg: 'bg-orange-100' },
    3: { label: 'Meets Expectations', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    4: { label: 'Exceeds Expectations', color: 'text-blue-600', bg: 'bg-blue-100' },
    5: { label: 'Outstanding', color: 'text-emerald-600', bg: 'bg-emerald-100' },
};

const STATUS_CONFIG: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-600',
    Submitted: 'bg-blue-100 text-blue-600',
    Acknowledged: 'bg-emerald-100 text-emerald-600',
};

export default function Index({ reviews, employees, stats, filters }: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    const openCreate = () => {
        setSelectedReview(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (review: any) => {
        setSelectedReview(review);
        setIsDrawerOpen(true);
    };

    const handleApplyFilters = (newFilters: any) => {
        router.get(route('hr.performance.index'), {
            ...newFilters,
            search: newFilters.search || undefined,
            rating: newFilters.rating !== 'All' ? newFilters.rating : undefined,
            category: newFilters.category !== 'All' ? newFilters.category : undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this performance review?')) {
            router.delete(route('hr.performance.destroy', id), { preserveScroll: true });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'employee',
            header: 'Employee',
            cell: (r) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-200">
                        {r.employee?.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{r.employee?.user?.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{r.category}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'score',
            header: 'Performance Score',
            cell: (r) => {
                const ratingCfg = RATING_LABELS[r.rating] || RATING_LABELS[3];
                return (
                    <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest", ratingCfg.color, ratingCfg.bg)}>
                            {ratingCfg.label}
                        </span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={cn("w-3 h-3", star <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                            ))}
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'period',
            header: 'Period',
            cell: (r) => (
                <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{r.period}</span>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            className: 'text-center',
            cell: (r) => (
                <div className="flex justify-center">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", STATUS_CONFIG[r.status] || 'bg-slate-100')}>
                        {r.status}
                    </span>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Performance Reviews</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{reviews.length} total evaluations</span>
                    </div>
                    <button
                        onClick={openCreate}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Review
                    </button>
                </div>
            }
        >
            <Head title="Performance Management" />

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
                    data={reviews}
                    getRowId={(r) => r.id}
                    renderActions={(r) => (
                        <div className="flex justify-end gap-1 items-center">
                            <button
                                onClick={() => openEdit(r)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(r.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    emptyMessage="No performance reviews found."
                />

                <CreatePerformanceDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    employees={employees}
                    review={selectedReview}
                />

                <PerformanceFilterDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                    currentSearch={filters?.search || ''}
                    currentRating={filters?.rating || 'All'}
                    currentCategory={filters?.category || 'All'}
                    employees={employees}
                    onApply={handleApplyFilters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
