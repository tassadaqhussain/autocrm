import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import Modal from '@/Components/Modal';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    departments: any[];
}

export default function Index({ departments }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<any>(null);

    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        name: ''
    });

    const handleOpenModal = (dept: any = null) => {
        setEditingDepartment(dept);
        setData({ name: dept ? dept.name : '' });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDepartment) {
            patch(route('hr.departments.update', editingDepartment.id), {
                onSuccess: handleCloseModal
            });
        } else {
            post(route('hr.departments.store'), {
                onSuccess: handleCloseModal
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('hr.departments.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'department',
            header: 'Department',
            cell: (dept) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{dept.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active Unit</p>
                    </div>
                </div>
            )
        },
        {
            id: 'designations',
            header: 'Designations',
            cell: (dept) => (
                <div className="text-[13px] text-slate-600 font-medium">
                    {dept.designations?.length || 0} Roles Defined
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            className: 'text-center',
            cell: () => (
                <div className="flex justify-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
                        Active
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
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Departments</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{departments.length} total units</span>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Department
                    </button>
                </div>
            }
        >
            <Head title="Departments" />

            <div className="max-w-[1600px] mx-auto py-8">
                <DataTable
                    columns={columns}
                    data={departments}
                    getRowId={(dept) => dept.id}
                    renderActions={(dept) => (
                        <div className="flex justify-end gap-1 items-center">
                            <button
                                onClick={() => handleOpenModal(dept)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(dept.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    emptyMessage="No departments found."
                />
            </div>

            <Modal show={isModalOpen} onClose={handleCloseModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">{editingDepartment ? 'Edit Department' : 'Create Department'}</h2>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full h-10 px-4 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:ring-0 focus:border-indigo-500 transition-colors"
                            placeholder="Enter department name..."
                            required
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1 font-medium">{errors.name}</div>}
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={handleCloseModal} className="h-10 px-4 text-sm font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                        <button type="submit" disabled={processing} className="h-10 px-6 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                            {editingDepartment ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
