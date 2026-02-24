import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    MapPin,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    Search,
    Filter,
    Stethoscope,
    Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Appointment {
    id: number;
    lead: { id: number; name: string; phone: string };
    doctor: { id: number; name: string };
    scheduled_at: string;
    duration: number;
    type: string;
    status: string;
    notes: string | null;
}

interface Props {
    appointments: Appointment[];
    doctors: { id: number; name: string }[];
    leads: { id: number; name: string }[];
}

export default function Index({ appointments, doctors, leads }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        lead_id: '',
        doctor_id: '',
        scheduled_at: '',
        duration: 30,
        type: 'Initial Consultation',
        notes: ''
    });

    const categories = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
    const [activeCategory, setActiveCategory] = useState('All');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-4">
                            <Calendar className="w-10 h-10 text-indigo-600" /> Clinic Schedule
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage patient visits and surgical consultations.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                        <Plus className="w-4 h-4" /> Schedule Visit
                    </button>
                </div>
            }
        >
            <Head title="Appointments" />

            <div className="space-y-10">
                {/* Horizontal Calendar Quick Selection */}
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                        const date = new Date();
                        date.setDate(date.getDate() + day);
                        const isActive = day === 0;
                        return (
                            <div key={day} className={cn(
                                "flex-shrink-0 w-24 p-5 rounded-[2rem] border flex flex-col items-center gap-2 cursor-pointer transition-all",
                                isActive ? "bg-slate-900 text-white border-transparent shadow-xl scale-105" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-xl font-black">{date.getDate()}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <div className="flex gap-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest transition-all relative pb-2",
                                    activeCategory === cat ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {cat}
                                {activeCategory === cat && <div className="absolute bottom-[-25px] left-0 right-0 h-1 bg-slate-900 rounded-full" />}
                            </button>
                        ))}
                    </div>
                    <div className="relative group w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input
                            placeholder="Find appointment..."
                            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-semibold focus:ring-2 focus:ring-slate-100"
                        />
                    </div>
                </div>

                {/* Grid of Appointments */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border",
                                    apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                )}>
                                    {apt.status}
                                </div>
                                <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{apt.lead?.name || 'Unknown Patient'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-slate-300" />
                                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{apt.lead?.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 rounded-3xl p-5 space-y-4 border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-slate-300" />
                                        <p className="text-xs font-black text-slate-700 uppercase">{new Date(apt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <span className="text-slate-400 font-bold ml-2">({apt.duration} MIN)</span></p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Stethoscope className="w-4 h-4 text-slate-300" />
                                        <p className="text-xs font-black text-slate-700 uppercase">DR. {apt.doctor?.name || 'Unassigned'}</p>
                                    </div>
                                </div>

                                {apt.notes && (
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic line-clamp-2">
                                        "{apt.notes}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Adding Appointment */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)} />
                    <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
                        <form onSubmit={submit}>
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule New Visit</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select patient and medical team for this session.</p>
                                </div>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-4 bg-white rounded-2xl hover:bg-slate-100 transition-all shadow-sm">
                                    <XCircle className="w-6 h-6 text-slate-300" />
                                </button>
                            </div>
                            <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                                    <select
                                        value={data.lead_id}
                                        onChange={e => setData('lead_id', e.target.value)}
                                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                    >
                                        <option value="">Choose Patient...</option>
                                        {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Doctor</label>
                                    <select
                                        value={data.doctor_id}
                                        onChange={e => setData('doctor_id', e.target.value)}
                                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                    >
                                        <option value="">Assign Specialist...</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Time</label>
                                        <input
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                            className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Mins)</label>
                                        <select
                                            value={data.duration}
                                            onChange={e => setData('duration', parseInt(e.target.value))}
                                            className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                        >
                                            <option value={15}>15 Minutes</option>
                                            <option value={30}>30 Minutes</option>
                                            <option value={60}>1 Hour</option>
                                            <option value={120}>2 Hours (Surgery)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Add specific instructions for the doctor..."
                                        className="w-full bg-slate-50 border-transparent rounded-[1.5rem] py-4 px-6 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-5">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-sm font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                                <button
                                    className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    disabled={processing}
                                >
                                    Confirm Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
