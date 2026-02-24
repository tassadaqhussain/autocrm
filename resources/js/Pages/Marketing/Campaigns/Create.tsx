import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Save,
    ArrowLeft,
    Target,
    Zap,
    DollarSign,
    Calendar,
    AlignLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface User {
    id: number;
    name: string;
}

interface Props {
    managers: User[];
}

export default function CampaignCreate({ managers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'Digital',
        channel: 'Meta Ads',
        objective: 'Lead Generation',
        budget: '',
        budget_type: 'Daily',
        assigned_manager_id: '',
        starts_at: '',
        ends_at: '',
        description: '',
        status: 'Draft',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marketing.campaigns.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('marketing.campaigns.index')}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                                New <span className="text-orange-500">Campaign</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Configure campaign parameters</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Create Campaign" />

            <div className="mt-8 max-w-5xl mx-auto">
                <form onSubmit={submit} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                    <Target className="w-4 h-4 text-indigo-500" /> Basic Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Campaign Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="e.g. Summer Rhinoplasty Promo"
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                        />
                                        {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Channel</label>
                                            <select
                                                value={data.channel}
                                                onChange={e => setData('channel', e.target.value)}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            >
                                                <option value="Meta Ads">Meta Ads (FB/IG)</option>
                                                <option value="Google Ads">Google Ads</option>
                                                <option value="WhatsApp">WhatsApp Official</option>
                                                <option value="Influencer">Influencer</option>
                                                <option value="Offline">Offline / Billboard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Objective</label>
                                            <select
                                                value={data.objective}
                                                onChange={e => setData('objective', e.target.value)}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            >
                                                <option value="Lead Generation">Lead Generation</option>
                                                <option value="Brand Awareness">Brand Awareness</option>
                                                <option value="Sales/Bookings">Sales / Bookings</option>
                                                <option value="Traffic">Website Traffic</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Active">Active</option>
                                            <option value="Paused">Paused</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> Budget & Schedule
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Budget Amount (SAR)</label>
                                            <input
                                                type="number"
                                                value={data.budget}
                                                onChange={e => setData('budget', e.target.value)}
                                                placeholder="e.g. 5000"
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            />
                                            {errors.budget && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.budget}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Budget Type</label>
                                            <select
                                                value={data.budget_type}
                                                onChange={e => setData('budget_type', e.target.value)}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            >
                                                <option value="Daily">Daily Budget</option>
                                                <option value="Lifetime">Lifetime Budget</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={data.starts_at}
                                                onChange={e => setData('starts_at', e.target.value)}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">End Date (Optional)</label>
                                            <input
                                                type="date"
                                                value={data.ends_at}
                                                onChange={e => setData('ends_at', e.target.value)}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assigned Manager</label>
                                        <select
                                            value={data.assigned_manager_id}
                                            onChange={e => setData('assigned_manager_id', e.target.value)}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all"
                                        >
                                            <option value="">Select Manager</option>
                                            {managers.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Full width */}
                        <div className="col-span-1 md:col-span-2 mt-4 pt-8 border-t border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <AlignLeft className="w-4 h-4 text-orange-500" /> Additional Details
                            </h3>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Campaign Notes / Target Audience Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition-all resize-none"
                                    placeholder="Describe the target audience, exact demographics, and specific goals..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className={cn(
                                "px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-200 transition-all",
                                processing ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                            )}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : 'Launch Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
