import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { CalendarDays, Plus, Edit2, Trash2, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import Drawer from '@/Components/Drawer';
import HolidayFilterDrawer from '@/Components/HR/HolidayFilterDrawer';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    holidays: any[];
    filters: any;
}

export default function Index({ holidays, filters }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        name: '',
        date: ''
    });

    const openCreate = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsOpen(true);
    };

    const openEdit = (holiday: any) => {
        setEditingId(holiday.id);
        setData({ name: holiday.name, date: holiday.date });
        clearErrors();
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            patch(route('hr.holidays.update', editingId), { onSuccess: close });
        } else {
            post(route('hr.holidays.store'), { onSuccess: close });
        }
    };

    const handleApplyFilters = (newFilters: any) => {
        router.get(route('hr.holidays.index'), {
            ...newFilters,
            search: newFilters.search || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this holiday?')) {
            router.delete(route('hr.holidays.destroy', id), { preserveScroll: true });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'holiday',
            header: 'Holiday',
            cell: (holiday) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{holiday.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Public Holiday</p>
                    </div>
                </div>
            )
        },
        {
            id: 'date',
            header: 'Date',
            cell: (holiday) => (
                <div className="flex items-center gap-2 text-slate-500 text-[12px] font-medium">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-300" />
                    <span>{formatDate(holiday.date)}</span>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Holidays</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{holidays.length} scheduled</span>
                    </div>
                    <button
                        onClick={openCreate}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Holiday
                    </button>
                </div>
            }
        >
            <Head title="Holidays" />

            <div className="max-w-[1600px] mx-auto py-8 lg:space-y-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        Search
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={holidays}
                    getRowId={(h) => h.id}
                    renderActions={(holiday) => (
                        <div className="flex justify-end gap-1 items-center">
                            <button
                                onClick={() => openEdit(holiday)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(holiday.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    emptyMessage="No holidays found."
                />
            </div>

            <Drawer
                isOpen={isOpen}
                onClose={close}
                title={editingId ? 'Edit Holiday' : 'Add Holiday'}
                maxWidth="max-w-md"
            >
                <form id="holiday-form" onSubmit={handleSubmit} className="p-1 space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Holiday Title</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full h-10 px-4 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:ring-0 focus:border-indigo-500 transition-colors"
                            placeholder="e.g. New Year's Day"
                            required
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1 font-medium">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full h-10 px-4 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:ring-0 focus:border-indigo-500 transition-all"
                            required
                        />
                        {errors.date && <div className="text-red-500 text-xs mt-1 font-medium">{errors.date}</div>}
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <button type="button" onClick={close} className="h-10 px-4 text-sm font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                        <button type="submit" disabled={processing} className="h-10 px-6 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Drawer>

            <HolidayFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentSearch={filters?.search || ''}
                onApply={handleApplyFilters}
            />
        </AuthenticatedLayout>
    );
}
