import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    ArrowRight,
    Sparkles,
    Facebook,
    Instagram,
    Globe,
    Smartphone,
    Check,
    ChevronRight,
    Search,
    Image as ImageIcon,
    Target,
    Users,
    Calendar,
    Wallet,
    Info,
    Layout,
    MoreHorizontal,
    Upload,
    Zap,
    MessageCircle,
    Monitor,
    MousePointer2,
    Eye,
    Edit3,
    ChevronLeft,
    ChevronDown,
    TrendingUp,
    Clock,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

interface Campaign {
    id: number;
    name: string;
    type: string;
    objective: string;
    status: string;
    budget: number;
    budget_type: string;
    ad_copy: string | null;
    ad_creative_url: string | null;
    target_audience: any;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    clinic?: {
        name: string;
    };
}

interface Props {
    campaign: Campaign;
}

const platforms = [
    { id: 'meta', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'google', name: 'Google Ads', icon: Globe, color: 'text-rose-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-slate-900' },
];

export default function Show({ campaign }: Props) {
    const platform = platforms.find(p => p.id === campaign.type.toLowerCase()) || platforms[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('campaigns.index')}
                            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                Ads Details
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Performance metrics and asset preview for {campaign.name}.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Campaign | ${campaign.name}`} />

            <div className="max-w-[1600px] mx-auto pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Content & Stats */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Summary Header */}
                        <div className="bg-white p-12 border border-slate-100 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
                            <div className="flex flex-wrap items-start justify-between gap-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{campaign.name}</h3>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                            campaign.status === 'Active' || campaign.status === 'Launched'
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-slate-50 text-slate-400 border-slate-200"
                                        )}>
                                            {campaign.status}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] items-center">
                                        <span className="flex items-center gap-2 italic">Last edited {format(new Date(campaign.updated_at), 'MMM d, yyyy')}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        <span className="flex items-center gap-2">
                                            Campaign duration: {campaign.starts_at ? format(new Date(campaign.starts_at), 'MMM d') : 'Now'} — {campaign.ends_at ? format(new Date(campaign.ends_at), 'MMM d, yyyy') : 'No end date'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 group-hover:bg-white transition-all duration-500">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5" /> Objective
                                    </span>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{campaign.objective}</p>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <platform.icon className={cn("w-3.5 h-3.5", platform.color)} /> Channel
                                    </span>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{platform.name}</p>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Wallet className="w-3.5 h-3.5" /> Account
                                    </span>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{campaign.clinic?.name || 'Main Clinic'}</p>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Created by
                                    </span>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic">System Admin</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* AI Recommendation Banner */}
                        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex items-center justify-between relative overflow-hidden group shadow-2xl shadow-indigo-100">
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex flex-col items-center justify-center backdrop-blur-md shrink-0 border border-white/10">
                                    <Sparkles className="w-8 h-8 text-white mb-1" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">AI AGENT</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic tracking-tight uppercase mb-1">Explore Ad Broader Reach</h4>
                                    <p className="text-indigo-100 text-xs font-medium max-w-lg opacity-80 uppercase tracking-widest leading-relaxed">Since reach is relatively low, expanding your audience via interests slightly may reduce costs by up to 14%.</p>
                                </div>
                            </div>
                            <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                        </div>

                        {/* Stats Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Statistic</h3>
                                <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all">
                                    {format(new Date(campaign.created_at), 'MMM dd')} - {format(new Date(), 'MMM dd, yyyy')} <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: 'Impression', value: '12,450', trend: '+1.34%', trendColor: 'text-emerald-500' },
                                    { label: 'Clicks', value: '1,232', trend: '+2%', trendColor: 'text-emerald-500' },
                                    { label: 'Reach', value: '45,820', trend: '+1.34%', trendColor: 'text-emerald-500' },
                                    { label: 'Spent', value: `${campaign.budget_type === 'Daily' ? 'SAR ' + (campaign.budget * 7).toLocaleString() : 'SAR ' + campaign.budget.toLocaleString()}`, trend: 'On Budget', trendColor: 'text-indigo-500' },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-white p-10 border border-slate-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all h-[180px]">
                                        <div className="flex flex-col gap-1 mb-8 relative z-10">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                            <div className="flex items-baseline gap-4 mt-2">
                                                <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{stat.value}</span>
                                                <span className={cn("text-xs font-black uppercase tracking-widest", stat.trendColor)}>{stat.trend}</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50/50 -z-0">
                                            <svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 20">
                                                <path d="M0 20 L0 10 Q 10 2 20 8 T 40 12 T 60 5 T 80 15 T 100 8 L 100 20 Z" fill="currentColor" className="text-indigo-600" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audience Breakdown */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Audience</h3>
                                <button className="text-[10px] font-black uppercase text-indigo-600 underline underline-offset-8 decoration-2 decoration-indigo-200 hover:decoration-indigo-600">
                                    +Add audience
                                </button>
                            </div>
                            <div className="bg-white p-10 border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-wrap gap-x-12 gap-y-8">
                                {campaign.target_audience?.locations?.map((loc: string) => (
                                    <div key={loc} className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{loc}</span>
                                    </div>
                                ))}
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Age Range</span>
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{campaign.target_audience?.age_range?.join(' - ') || '25 - 55'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interests</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {campaign.target_audience?.interests?.map((interest: string) => (
                                            <span key={interest} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Ad Preview & Tools */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Ad Preview Card */}
                        <div className="sticky top-8 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Ads Preview</h3>
                                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-white/50 relative group">
                                    {/* Ad Header */}
                                    <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                                        <div className="w-12 h-12 bg-slate-900 rounded-full p-0.5 ring-2 ring-slate-100">
                                            <div className="w-full h-full bg-slate-800 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black text-white italic">EMC</div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 leading-none tracking-tight">Elite Medical Clinic</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                                Sponsored <Globe className="w-3 h-3" />
                                            </p>
                                        </div>
                                        <button className="ml-auto p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Ad Copy */}
                                    <div className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                                            "{campaign.ad_copy || "Transform your life with our advanced medical programs at Elite Medical Riyadh."}"
                                        </p>
                                    </div>

                                    {/* Ad Creative Image Area */}
                                    <div className="relative aspect-square bg-slate-100 overflow-hidden group/img">
                                        <img
                                            src={campaign.ad_creative_url || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"}
                                            className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1] transition-transform duration-[1.5s] group-hover/img:scale-110"
                                            alt="Ad Preview"
                                        />
                                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">High Conversions</span>
                                        </div>
                                    </div>

                                    {/* Ad CTA Footer */}
                                    <div className="p-8 bg-slate-50/80 flex justify-between items-center border-t border-slate-100">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Elite Medical Riyadh</p>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Schedule Your Visit</p>
                                        </div>
                                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                                            Learn More
                                        </button>
                                    </div>

                                    {/* Engagement Indicators */}
                                    <div className="px-8 py-6 flex items-center gap-8 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2.5">
                                                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden border border-white/20">
                                                    <Facebook className="w-3.5 h-3.5 text-white fill-current" />
                                                </div>
                                                <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-white shadow-lg border border-white/20">
                                                    <Plus className="w-3.5 h-3.5 text-white stroke-[4]" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">12.4k</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">248 Comments</span>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Internal Notes</h3>
                                <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                                    <div className="relative group">
                                        <textarea
                                            placeholder="Add notes for the sales team..."
                                            className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-slate-50 transition-all resize-none min-h-[120px] italic placeholder:text-slate-300"
                                        />
                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">#</button>
                                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">@</button>
                                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Smartphone className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">EM</div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-tighter">Only visible to Counselors</span>
                                        </div>
                                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
