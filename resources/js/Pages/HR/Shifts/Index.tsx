import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Clock, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    shifts: any[];
}

export default function Index({ shifts }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        name: '',
        start_time: '',
        end_time: ''
    });

    const handleCreateOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            patch(route('hr.shifts.update', editingId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('hr.shifts.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this shift?')) {
            router.delete(route('hr.shifts.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${minutes} ${ampm}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Operational Shifts</h2>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setData({ name: '', start_time: '', end_time: '' });
                            clearErrors();
                            setIsModalOpen(true);
                        }}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Shift
                    </button>
                </div>
            }
        >
            <Head title="Operational Shifts" />

            <div className="max-w-[1600px] mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {shifts.map((shift) => (
                        <div key={shift.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                            {shift.employees_count || 0} Staff
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{shift.name}</h3>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Starts</div>
                                        <div className="text-xs font-bold text-slate-700">{formatTime(shift.start_time)}</div>
                                    </div>
                                    <div className="text-slate-300">-</div>
                                    <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ends</div>
                                        <div className="text-xs font-bold text-slate-700">{formatTime(shift.end_time)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setEditingId(shift.id);
                                        setData({ name: shift.name, start_time: shift.start_time, end_time: shift.end_time });
                                        clearErrors();
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600 border border-transparent rounded-lg transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(shift.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-600 border border-transparent rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {shifts.length === 0 && (
                        <div className="col-span-full bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Shifts Found</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-2">Create your primary operational shifts to manage staff schedules.</p>
                        </div>
                    )}

                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); reset(); clearErrors(); }} maxWidth="md">
                <form onSubmit={handleCreateOrUpdate} className="p-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">
                        {editingId ? 'Edit Shift' : 'Create New Shift'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Shift Title</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Morning Shift, Full Day, Night Duty"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Start Time</label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                />
                                {errors.start_time && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.start_time}</div>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">End Time</label>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border-slate-200 rounded-xl text-sm font-semibold focus:ring-0 focus:border-indigo-500 transition-colors"
                                />
                                {errors.end_time && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.end_time}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setIsModalOpen(false); setEditingId(null); reset(); clearErrors(); }}
                            className="h-10 px-5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 px-6 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Shift')}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
