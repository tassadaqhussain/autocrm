import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Award, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Drawer from '@/Components/Drawer';

interface Props {
    appreciations: any[];
    employees: any[];
}

export default function Index({ appreciations, employees }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        employee_id: '',
        title: '',
        description: '',
        given_date: '',
        cc_email: ''
    });

    const openCreate = () => {
        setEditingId(null);
        setData({ employee_id: employees[0]?.id || '', title: '', description: '', given_date: new Date().toISOString().split('T')[0], cc_email: '' });
        clearErrors();
        setIsOpen(true);
    };

    const openEdit = (appr: any) => {
        setEditingId(appr.id);
        setData({ employee_id: appr.employee_id, title: appr.title, description: appr.description || '', given_date: appr.given_date, cc_email: '' });
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
            patch(route('hr.appreciations.update', editingId), { onSuccess: close });
        } else {
            post(route('hr.appreciations.store'), { onSuccess: close });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this appreciation?')) {
            router.delete(route('hr.appreciations.destroy', id), { preserveScroll: true });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Appreciations</h2>
                    <button onClick={openCreate} className="h-10 px-5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Give Appreciation
                    </button>
                </div>
            }
        >
            <Head title="Appreciations" />

            <div className="max-w-[1600px] mx-auto py-8">
                {appreciations.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Appreciations</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-2">Recognize your employees' hard work here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Employee</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Award Title</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Description</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Given On</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appreciations.map(appr => (
                                    <tr key={appr.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{appr.employee?.user?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 font-semibold text-indigo-600">{appr.title}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{appr.description}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{formatDate(appr.given_date)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(appr)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(appr.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Drawer
                isOpen={isOpen}
                onClose={close}
                title={editingId ? 'Edit Appreciation' : 'Give Appreciation'}
                description="Acknowledge great work"
                maxWidth="max-w-lg"
                footer={
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            form="appreciation-form"
                            disabled={processing}
                            className="h-9 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Save Appreciation
                        </button>
                        <button type="button" onClick={close} className="h-9 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Cancel
                        </button>
                    </div>
                }
            >
                <form id="appreciation-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Employee <span className="text-red-500">*</span></label>
                            <select
                                value={data.employee_id}
                                onChange={e => setData('employee_id', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            >
                                <option value="" disabled>-- Select --</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.user?.name}</option>
                                ))}
                            </select>
                            {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Award Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={data.given_date}
                                onChange={e => setData('given_date', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                            {errors.given_date && <p className="text-red-500 text-xs mt-1">{errors.given_date}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Award Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="e.g. Employee of the Month"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-none"
                            rows={4}
                            placeholder="Reason for appreciation..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">CC Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <input
                            type="email"
                            value={data.cc_email}
                            onChange={e => setData('cc_email', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="e.g. manager@clinic.com"
                        />
                        {errors.cc_email && <p className="text-red-500 text-xs mt-1">{errors.cc_email}</p>}
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
