import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEventHandler } from 'react';
import {
    User,
    Phone,
    MessageSquare,
    Target,
    Scale,
    AlertCircle,
    UserCheck,
    ArrowLeft,
    CheckCircle2,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Campaign {
    id: number;
    name: string;
}

interface Counselor {
    id: number;
    name: string;
}

interface Props {
    campaigns: Campaign[];
    counselors: Counselor[];
}

export default function Create({ campaigns, counselors }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        source: 'WhatsApp (Meta Ads)',
        campaign_id: '',
        counselor_id: '',
        bmi: '',
        health_info: '',
        urgency: 'Medium',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('leads.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('leads.index')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Patient Registration
                        </h2>
                        <p className="text-slate-500 text-sm">Add a new lead to your patient pipeline manually.</p>
                    </div>
                </div>
            }
        >
            <Head title="Add Patient Lead" />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={submit} className="space-y-8 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Primary Information */}
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Patient Detail</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                Full Clinical Name
                                            </InputLabel>
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm"
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. John Doe"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                Phone / WhatsApp
                                            </InputLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    name="phone"
                                                    value={data.phone}
                                                    className="block w-full pl-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm"
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+92 300 1234567"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="health_info" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            Health Background & Notes
                                        </InputLabel>
                                        <textarea
                                            id="health_info"
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl transition-all shadow-sm min-h-[120px]"
                                            value={data.health_info}
                                            placeholder="Discuss medical history, primary concerns, and desired outcomes..."
                                            onChange={(e) => setData('health_info', e.target.value)}
                                        ></textarea>
                                        <InputError message={errors.health_info} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Source & Assignment</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="source" className="text-xs font-bold uppercase tracking-wider text-slate-500">Marketing Source</InputLabel>
                                        <select
                                            id="source"
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                            value={data.source}
                                            onChange={(e) => setData('source', e.target.value)}
                                        >
                                            <option value="WhatsApp (Meta Ads)">WhatsApp (Meta Ads)</option>
                                            <option value="Campaign Numbers">Campaign Numbers</option>
                                            <option value="Direct Call">Direct Call</option>
                                            <option value="Referral">Referral</option>
                                        </select>
                                        <InputError message={errors.source} />
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="campaign_id" className="text-xs font-bold uppercase tracking-wider text-slate-500">Attribution Campaign</InputLabel>
                                        <select
                                            id="campaign_id"
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                            value={data.campaign_id}
                                            onChange={(e) => setData('campaign_id', e.target.value)}
                                        >
                                            <option value="">Manual Entry (No Campaign)</option>
                                            {campaigns.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.campaign_id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Metrics Sidebar */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Clinical Metrics</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="bmi" className="text-xs font-bold uppercase tracking-wider text-slate-500">Body Mass Index (BMI)</InputLabel>
                                        <TextInput
                                            id="bmi"
                                            type="number"
                                            step="0.1"
                                            name="bmi"
                                            value={data.bmi}
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm"
                                            placeholder="e.g. 28.5"
                                            onChange={(e) => setData('bmi', e.target.value)}
                                        />
                                        <InputError message={errors.bmi} />
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="urgency" className="text-xs font-bold uppercase tracking-wider text-slate-500">Response Urgency</InputLabel>
                                        <div className="grid grid-cols-1 gap-2">
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setData('urgency', level)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all text-left flex justify-between items-center group",
                                                        data.urgency === level
                                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                                    )}
                                                >
                                                    {level}
                                                    {data.urgency === level && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                </button>
                                            ))}
                                        </div>
                                        <InputError message={errors.urgency} />
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-50">
                                        <InputLabel htmlFor="counselor_id" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <UserCheck className="w-3.5 h-3.5" /> Assigned Counselor
                                        </InputLabel>
                                        <select
                                            id="counselor_id"
                                            className="block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm text-sm"
                                            value={data.counselor_id}
                                            onChange={(e) => setData('counselor_id', e.target.value)}
                                        >
                                            <option value="">Waitlist / Unassigned</option>
                                            {counselors.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-start gap-2 mt-2 px-1">
                                            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-slate-400 font-medium leading-tight">Leave unassigned to let the system auto-distribute based on workload.</p>
                                        </div>
                                        <InputError message={errors.counselor_id} />
                                    </div>
                                </div>
                            </div>

                            <PrimaryButton
                                className="w-full justify-center rounded-2xl bg-indigo-600 py-6 text-base font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                                disabled={processing}
                            >
                                <CheckCircle2 className="w-5 h-5 mr-2" /> Register Patient
                            </PrimaryButton>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Instant sync with pipeline
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
