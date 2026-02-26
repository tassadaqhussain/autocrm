import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Check, X, FileText, Calendar, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import CreateLeaveDrawer from '@/Components/HR/CreateLeaveDrawer';
import LeaveFilterDrawer from '@/Components/HR/LeaveFilterDrawer';
import DataTable, { DataTableColumn } from '@/Components/DataTable';
import { cn } from '@/lib/utils';

interface Props {
    leaves: any[];
    employees: any[];
    leaveTypes: any[];
    filters: any;
}

export default function Index({ leaves, employees, leaveTypes, filters }: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<any>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this leave request?')) {
            router.delete(route('hr.leave.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleApprove = (id: number) => {
        router.patch(route('hr.leave.approve', id), {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.patch(route('hr.leave.reject', id), {}, { preserveScroll: true });
    };

    const handleApplyFilters = (newFilters: any) => {
        router.get(route('hr.leave.index'), {
            ...newFilters,
            search: newFilters.search || undefined,
            status: newFilters.status !== 'All' ? newFilters.status : undefined,
            type: newFilters.type !== 'All' ? newFilters.type : undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const columns: DataTableColumn<any>[] = useMemo(() => [
        {
            id: 'employee',
            header: 'Employee',
            cell: (leave) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-200">
                        {leave.employee?.user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-[13px]">{leave.employee?.user?.name || 'Unknown'}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{leave.employee?.user?.email}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'type',
            header: 'Leave Type',
            cell: (leave) => (
                <div className="py-1">
                    <p className="font-medium text-indigo-600 text-[13px]">{leave.leave_type?.name || 'Unknown'}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{leave.duration_type}</p>
                </div>
            )
        },
        {
            id: 'dates',
            header: 'Duration',
            cell: (leave) => (
                <div className="flex items-center gap-2 text-slate-600 text-[12px] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>{leave.start_date}</span>
                    {leave.duration_type === 'Multiple' && leave.end_date && leave.end_date !== leave.start_date && (
                        <span className="text-slate-400">thru {leave.end_date}</span>
                    )}
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            className: 'text-center',
            cell: (leave) => (
                <div className="flex justify-center">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                    )}>
                        {leave.status}
                    </span>
                </div>
            )
        },
        {
            id: 'attachment',
            header: 'Files',
            className: 'text-center',
            cell: (leave) => (
                <div className="flex justify-center">
                    {leave.attachment ? (
                        <a href={`/storage/${leave.attachment}`} target="_blank" className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View Attachment">
                            <FileText className="w-4 h-4" />
                        </a>
                    ) : (
                        <span className="text-xs text-slate-300 font-medium">-</span>
                    )}
                </div>
            )
        }
    ], []);

    const renderActions = (leave: any) => (
        <div className="flex justify-end gap-1 items-center">
            {leave.status === 'Pending' && (
                <>
                    <button title="Approve" onClick={() => handleApprove(leave.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                    </button>
                    <button title="Reject" onClick={() => handleReject(leave.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors border border-rose-100">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </>
            )}
            <button
                onClick={() => {
                    setSelectedLeave(leave);
                    setIsDrawerOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors border border-slate-200"
                title="Edit"
            >
                <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => handleDelete(leave.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors border border-slate-200"
                title="Delete"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-indigo-600">Leaves</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{leaves.length} total records</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedLeave(null);
                            setIsDrawerOpen(true);
                        }}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Assign Leave
                    </button>
                </div>
            }
        >
            <Head title="Leave Management" />

            <div className="max-w-[1600px] mx-auto py-8 lg:space-y-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        Refine Archive
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={leaves}
                    getRowId={(l) => l.id}
                    renderActions={renderActions}
                    emptyMessage="No leave records found."
                />

                <CreateLeaveDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedLeave(null);
                    }}
                    employees={employees}
                    leaveTypes={leaveTypes}
                    leave={selectedLeave}
                />

                <LeaveFilterDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                    currentSearch={filters?.search || ''}
                    currentStatus={filters?.status || 'All'}
                    currentType={filters?.type || 'All'}
                    leaveTypes={leaveTypes}
                    onApply={handleApplyFilters}
                />
            </div>
        </AuthenticatedLayout>
    );
}
