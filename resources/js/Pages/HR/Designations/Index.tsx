import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Award, Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import CreateDesignationDrawer from '@/Components/HR/CreateDesignationDrawer';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    designations: any[];
    departments: any[];
}

export default function Index({ designations, departments }: Props) {
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState<any>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this designation?')) {
            router.delete(route('hr.designations.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'designation',
            header: 'Designation',
            cell: (designation) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{designation.title}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active Role</p>
                    </div>
                </div>
            )
        },
        {
            id: 'department',
            header: 'Department',
            cell: (designation) => {
                const dept = departments.find(d => d.id === designation.department_id);
                return (
                    <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[13px] text-slate-600 font-medium">{dept?.name || 'Unassigned'}</span>
                    </div>
                );
            }
        },
        {
            id: 'status',
            header: 'Status',
            className: 'text-center',
            cell: () => (
                <div className="flex justify-center">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        Standard
                    </span>
                </div>
            )
        }
    ], [departments]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Designations</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{designations.length} total roles</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedDesignation(null);
                            setIsCreateDrawerOpen(true);
                        }}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Designation
                    </button>
                </div>
            }
        >
            <Head title="Designations" />

            <div className="max-w-[1600px] mx-auto py-8">
                <DataTable
                    columns={columns}
                    data={designations}
                    getRowId={(role) => role.id}
                    renderActions={(designation) => (
                        <div className="flex justify-end gap-1 items-center">
                            <button
                                onClick={() => {
                                    setSelectedDesignation(designation);
                                    setIsCreateDrawerOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(designation.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    emptyMessage="No designations found."
                />
            </div>

            <CreateDesignationDrawer
                isOpen={isCreateDrawerOpen}
                onClose={() => { setSelectedDesignation(null); setIsCreateDrawerOpen(false); }}
                departments={departments}
                designation={selectedDesignation}
            />
        </AuthenticatedLayout>
    );
}
