import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { CalendarDays, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Drawer from '@/Components/Drawer';

interface Props {
    holidays: any[];
}

export default function Index({ holidays }: Props) {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleDelete = (id: number) => {
        if (confirm('Delete this holiday?')) {
            router.delete(route('hr.holidays.destroy', id), { preserveScroll: true });
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Clinic Holidays</h2>
                    <button onClick={openCreate} className="h-10 px-5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Holiday
                    </button>
                </div>
            }
        >
            <Head title="Holidays" />

            <div className="max-w-[1600px] mx-auto py-8">
                {holidays.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Holidays</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-2">Add the clinic's official holidays here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Holiday Name</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Date</th>
                                    <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {holidays.map(holiday => (
                                    <tr key={holiday.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{holiday.name}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{formatDate(holiday.date)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(holiday)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(holiday.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200">
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
                title={editingId ? 'Edit Holiday' : 'Add Holiday'}
                description="Global clinic schedule"
                maxWidth="max-w-md"
                footer={
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            form="holiday-form"
                            disabled={processing}
                            className="h-9 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Save Holiday
                        </button>
                        <button type="button" onClick={close} className="h-9 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Cancel
                        </button>
                    </div>
                }
            >
                <form id="holiday-form" onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Holiday Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="e.g. Independence Day, Eid, Christmas"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
