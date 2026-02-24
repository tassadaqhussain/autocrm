import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    leaves: any[];
    employees: any[];
    leaveTypes: any[];
}

export default function Index({ leaves, employees, leaveTypes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        employee_id: '',
        leave_type_id: '',
        duration_type: 'Full Day',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'Pending',
        attachment: null as File | null,
    });

    const handleCreateOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert pseudo-PATCH for file upload support in Inertia
        if (editingId) {
            router.post(route('hr.leave.update', editingId), {
                _method: 'patch',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('hr.leave.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Leave Tracking</h2>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setData({
                                employee_id: employees[0]?.id || '',
                                leave_type_id: leaveTypes[0]?.id || '',
                                duration_type: 'Full Day',
                                start_date: '',
                                end_date: '',
                                reason: '',
                                status: 'Pending',
                                attachment: null
                            });
                            clearErrors();
                            setIsModalOpen(true);
                        }}
                        className="h-10 px-5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Assign Leave
                    </button>
                </div>
            }
        >
            <Head title="Leave Tracking" />

            <div className="max-w-[1600px] mx-auto py-8">
                {leaves.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mt-6">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Leave Records</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-2">Manage employee time off and assignments here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50/80 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Employee</th>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Type & Duration</th>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Dates</th>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</th>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Attachment</th>
                                        <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{leave.employee?.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{leave.employee?.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-indigo-600">{leave.leave_type?.name || 'Unknown'}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{leave.duration_type}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-700">{leave.start_date}</div>
                                                {leave.duration_type === 'Multiple' && leave.end_date && leave.end_date !== leave.start_date && (
                                                    <div className="text-xs text-slate-500">to {leave.end_date}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {leave.attachment ? (
                                                    <a href={`/storage/${leave.attachment}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                                        <FileText className="w-3.5 h-3.5" /> View
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-semibold">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    {leave.status === 'Pending' && (
                                                        <>
                                                            <button title="Approve" onClick={() => handleApprove(leave.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button title="Reject" onClick={() => handleReject(leave.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200">
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        title="Edit"
                                                        onClick={() => {
                                                            setEditingId(leave.id);
                                                            setData({
                                                                employee_id: leave.employee_id,
                                                                leave_type_id: leave.leave_type_id,
                                                                duration_type: leave.duration_type || 'Full Day',
                                                                start_date: leave.start_date,
                                                                end_date: leave.end_date,
                                                                reason: leave.reason || '',
                                                                status: leave.status,
                                                                attachment: null
                                                            });
                                                            clearErrors();
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button title="Delete" onClick={() => handleDelete(leave.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 hover:border-rose-200">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Match the UI of New Leave inside the Modal */}
            <Modal show={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); reset(); clearErrors(); }} maxWidth="2xl">
                <form onSubmit={handleCreateOrUpdate} className="bg-white">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{editingId ? 'Edit Leave Request' : 'Assign Leave'}</h2>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{editingId ? 'Update details' : 'Register a new absence'}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Top row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Choose Member <span className="text-red-500">*</span></label>
                                <select
                                    value={data.employee_id}
                                    onChange={e => setData('employee_id', e.target.value)}
                                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                >
                                    <option value="" disabled>-- Select --</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.user?.name}</option>
                                    ))}
                                </select>
                                {errors.employee_id && <div className="text-red-500 text-xs mt-1">{errors.employee_id}</div>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Leave Type <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <select
                                        value={data.leave_type_id}
                                        onChange={e => setData('leave_type_id', e.target.value)}
                                        className="flex-1 h-10 px-3 bg-white border border-slate-300 rounded-l-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm min-w-0"
                                    >
                                        <option value="" disabled>-- Select --</option>
                                        {leaveTypes.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.days_per_year})</option>
                                        ))}
                                    </select>
                                    <button type="button" className="h-10 px-3 border-y border-r border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-r-md text-sm font-medium text-slate-600 transition-colors shadow-sm">
                                        Add
                                    </button>
                                </div>
                                {errors.leave_type_id && <div className="text-red-500 text-xs mt-1">{errors.leave_type_id}</div>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-4">Select Duration <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap items-center gap-6">
                                {['Full Day', 'Multiple', 'First Half', 'Second Half'].map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            checked={data.duration_type === type}
                                            onChange={() => setData('duration_type', type)}
                                            className="w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className={`grid gap-6 ${data.duration_type === 'Multiple' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => {
                                        setData(prev => ({
                                            ...prev,
                                            start_date: e.target.value,
                                            // Auto-sync end date if not multiple
                                            end_date: prev.duration_type !== 'Multiple' ? e.target.value : prev.end_date
                                        }));
                                    }}
                                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                                {errors.start_date && <div className="text-red-500 text-xs mt-1">{errors.start_date}</div>}
                            </div>

                            {(data.duration_type === 'Multiple') && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">End Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                    {errors.end_date && <div className="text-red-500 text-xs mt-1">{errors.end_date}</div>}
                                </div>
                            )}
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Reason for absence <span className="text-red-500">*</span></label>
                            <textarea
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                className="w-full p-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm resize-none"
                                rows={4}
                                placeholder="e.g. Feeling not well"
                            />
                            {errors.reason && <div className="text-red-500 text-xs mt-1">{errors.reason}</div>}
                        </div>

                        {/* Attachment Drag Drop Area */}
                        <div>
                            <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-2">
                                Add File <HelpCircle className="w-3 h-3 text-slate-400" />
                            </label>
                            <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 transition-colors relative flex items-center justify-center">
                                <input
                                    type="file"
                                    onChange={e => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center group">
                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                                        {data.attachment ? data.attachment.name : 'Choose a file'}
                                    </span>
                                </div>
                            </div>
                            {errors.attachment && <div className="text-red-500 text-xs mt-1">{errors.attachment}</div>}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-start gap-4 bg-slate-50 rounded-b-2xl">
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-9 px-5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                        >
                            <CheckCircle className="w-4 h-4" /> Save
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsModalOpen(false); setEditingId(null); reset(); clearErrors(); }}
                            className="h-9 px-5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

// Ensure HelpCircle icon is defined or import it separately.
function HelpCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    )
}
