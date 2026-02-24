import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { FormEventHandler } from 'react';
import {
    User,
    Phone,
    Calendar,
    Target,
    MessageSquare,
    UserCheck,
    Scale,
    AlertCircle,
    CheckCircle2,
    FileText,
    Camera,
    History,
    ChevronLeft,
    MoreVertical,
    Zap,
    Stethoscope,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
    id: number;
    name: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    bmi: number;
    urgency: string;
    health_info: string;
    campaign?: { name: string };
    counselor?: { id: number, name: string };
    consultation?: {
        doctor_name: string;
        is_surgical_candidate: boolean;
        notes: string;
    };
    mediaConsent?: {
        has_consented: boolean;
        is_success_story: boolean;
        media_manager_notified: boolean;
    };
    created_at: string;
}

interface Props {
    lead: Lead;
    counselors: { id: number, name: string }[];
}

export default function Show({ lead, counselors }: Props) {
    const { data, setData, patch, processing } = useForm({
        status: lead.status,
        counselor_id: lead.counselor?.id || '',
        bmi: lead.bmi || '',
        health_info: lead.health_info || '',
        urgency: lead.urgency,
    });

    const updateLead: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('leads.update', lead.id));
    };

    const statusSteps = [
        'New',
        'Contacted',
        'Appointment Scheduled',
        'Consultation Done'
    ];

    const currentStatusIndex = statusSteps.indexOf(lead.status);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('leads.index')}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                                {lead.name}
                                <span className={cn(
                                    "px-2.5 py-1 text-[10px] rounded-lg font-bold uppercase tracking-widest",
                                    getStatusStyles(lead.status)
                                )}>
                                    {lead.status}
                                </span>
                            </h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" /> {lead.phone}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-xs text-indigo-500 font-bold flex items-center gap-1.5">
                                    <Target className="w-3.5 h-3.5" /> {lead.campaign?.name || lead.source}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm transition-all">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Patient: ${lead.name}`} />

            <div className="space-y-8 pb-12">
                {/* Status Progression Bar */}
                <div className="bg-white p-8 border border-slate-200 rounded-3xl shadow-sm">
                    <div className="flex justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 -z-0"></div>
                        <div
                            className="absolute top-4 left-0 h-1 bg-indigo-600 transition-all duration-1000 -z-0"
                            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                        ></div>

                        {statusSteps.map((step, idx) => (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={cn(
                                    "w-9 h-9 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                                    idx <= currentStatusIndex
                                        ? "bg-indigo-600 border-white text-white shadow-lg shadow-indigo-100"
                                        : "bg-white border-slate-100 text-slate-300"
                                )}>
                                    {idx < currentStatusIndex ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-tighter text-center max-w-[80px]",
                                    idx <= currentStatusIndex ? "text-slate-900" : "text-slate-400"
                                )}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Interaction Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">Counselor Interaction Log</h3>
                            </div>

                            <form onSubmit={updateLead} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Pipeline Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                        >
                                            <option value="New">New Lead Prospect</option>
                                            <option value="Contacted">Initial Contact Made</option>
                                            <option value="Appointment Scheduled">Appointment Confirmed</option>
                                            <option value="Consultation Done">Consultation Completed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Assigned Counselor</label>
                                        <select
                                            value={data.counselor_id}
                                            onChange={e => setData('counselor_id', parseFloat(e.target.value))}
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                        >
                                            <option value="">Unassigned Waitlist</option>
                                            {counselors.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 flex items-center gap-1.5"><Scale className="w-3 h-3" /> BMI</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={data.bmi}
                                            onChange={e => setData('bmi', e.target.value)}
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Urgency</label>
                                        <select
                                            value={data.urgency}
                                            onChange={e => setData('urgency', e.target.value)}
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                        >
                                            <option value="Low">Low Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="High">High / Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 flex items-center gap-1.5"><History className="w-3 h-3" /> Counselor Case Notes</label>
                                    <textarea
                                        value={data.health_info}
                                        onChange={e => setData('health_info', e.target.value)}
                                        rows={4}
                                        className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl transition-all shadow-sm text-sm min-h-[120px]"
                                        placeholder="Record observations, patient feedback, and next steps..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <PrimaryButton
                                        disabled={processing}
                                        className="rounded-xl px-8 py-3 bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                                    >
                                        Save Case Updates
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Consultation Section */}
                        {lead.status === 'Consultation Done' && (
                            <div className="bg-emerald-600 border border-emerald-500 rounded-3xl shadow-xl shadow-emerald-50 overflow-hidden text-white">
                                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                                            <Stethoscope className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-base font-bold uppercase tracking-widest">Medical Consultation</h3>
                                    </div>
                                    <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                                </div>
                                <div className="p-6">
                                    {lead.consultation ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Physician in Charge</span>
                                                    <span className="text-lg font-bold">Dr. {lead.consultation.doctor_name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Surgical Eligibility</span>
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit mt-1",
                                                        lead.consultation.is_surgical_candidate ? "bg-white text-emerald-600" : "bg-emerald-700 text-emerald-300"
                                                    )}>
                                                        {lead.consultation.is_surgical_candidate ? 'Cleared for Surgery' : 'Further Eval Required'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col bg-emerald-700/50 p-4 rounded-2xl border border-white/5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-2">Doctor's Clinical Notes</span>
                                                <p className="text-sm italic leading-relaxed text-emerald-50">"{lead.consultation.notes}"</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 bg-emerald-700/30 rounded-2xl border border-white/5 border-dashed">
                                            <p className="text-sm font-medium opacity-80 italic">No formal consultation data linked to this record yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Media & Consent Section */}
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Digital Privacy & Consent</h3>
                                </div>
                                {lead.mediaConsent?.has_consented && (
                                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md tracking-tighter">Verified Secure</span>
                                )}
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={cn(
                                    "p-4 rounded-2xl border transition-all flex flex-col gap-3",
                                    lead.mediaConsent?.has_consented ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex justify-between items-start">
                                        <FileText className={cn("w-6 h-6", lead.mediaConsent?.has_consented ? "text-emerald-600" : "text-slate-300")} />
                                        {lead.mediaConsent?.has_consented ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShieldCheck className="w-4 h-4 text-slate-300" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 leading-tight">Patient Consent</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">
                                            {lead.mediaConsent?.has_consented ? 'Obtained' : 'Pending Request'}
                                        </span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl border transition-all flex flex-col gap-3",
                                    lead.mediaConsent?.is_success_story ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex justify-between items-start">
                                        <Camera className={cn("w-6 h-6", lead.mediaConsent?.is_success_story ? "text-amber-600" : "text-slate-300")} />
                                        {lead.mediaConsent?.is_success_story && <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 leading-tight">Success Journey</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">
                                            {lead.mediaConsent?.is_success_story ? 'Flagged for PR' : 'Not Evaluated'}
                                        </span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl border transition-all flex flex-col gap-3",
                                    lead.mediaConsent?.media_manager_notified ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex justify-between items-start">
                                        <UserCheck className={cn("w-6 h-6", lead.mediaConsent?.media_manager_notified ? "text-indigo-600" : "text-slate-300")} />
                                        {lead.mediaConsent?.media_manager_notified && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 leading-tight">Media Team</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">
                                            {lead.mediaConsent?.media_manager_notified ? 'Hand-off Done' : 'No Assignment'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!lead.mediaConsent?.has_consented && (
                                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                                    <button className="text-[11px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2 hover:bg-white px-4 py-2 rounded-lg transition-all border border-transparent hover:border-indigo-100">
                                        <Phone className="w-3.5 h-3.5" /> Send Consent Form via WhatsApp
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Stats Area */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Quality Score Card */}
                        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm text-center relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lead Quality Index</span>
                                <div className="relative">
                                    <div className="text-6xl font-black text-slate-900 leading-none group-hover:scale-110 transition-transform duration-500">{lead.score}</div>
                                    <Zap className="absolute -top-4 -right-6 w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000", getScoreColor(lead.score))}
                                        style={{ width: `${Math.min(lead.score, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-4 tracking-widest">
                                    {lead.score >= 70 ? 'Highly Qualified' : lead.score >= 40 ? 'Potentially Qualified' : 'Cold Prospect'}
                                </p>
                            </div>
                            {/* Decorative Grid */}
                            <div className="absolute top-0 right-0 p-2 opacity-[0.03]">
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className="w-1 h-1 bg-slate-900 rounded-full"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Attribution Card */}
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Lead Attribution</h4>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                    <span className="text-xs font-medium text-slate-400">Marketing Core</span>
                                    <span className="text-xs font-bold text-slate-700">{lead.source}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                    <span className="text-xs font-medium text-slate-400">Active Campaign</span>
                                    <span className="text-xs font-bold text-indigo-600">{lead.campaign?.name || 'Manual Admission'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400">Registered On</span>
                                    <span className="text-xs font-bold text-slate-700">{new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-900 text-white flex flex-col items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time in Pipeline</span>
                                <span className="text-2xl font-black">2.4 Days</span>
                                <div className="text-[10px] font-bold text-emerald-400 uppercase mt-1 tracking-tighter">Fast-tracked Entry</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'New': return 'bg-blue-50 text-blue-600 border border-blue-100';
        case 'Contacted': return 'bg-amber-50 text-amber-600 border border-amber-100';
        case 'Appointment Scheduled': return 'bg-purple-50 text-purple-600 border border-purple-100';
        case 'Consultation Done': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
}

function getScoreColor(score: number) {
    if (score >= 70) return 'bg-emerald-500 shadow-sm shadow-emerald-200';
    if (score >= 40) return 'bg-amber-500 shadow-sm shadow-amber-200';
    return 'bg-rose-500 shadow-sm shadow-rose-200';
}
