import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Zap,
    Target,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    MousePointer2,
    BarChart3,
    Calendar,
    ChevronRight,
    Plus,
    Activity,
    Search,
    MessageSquare,
    Globe,
    Instagram,
    Facebook,
    Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

interface Props {
    stats: {
        total_campaigns: number;
        active_campaigns: number;
        total_leads: number;
        total_spend: number;
        cpl: number;
        conversion_rate: number;
    };
    leads_by_source: any[];
    performance_data: any[];
}

export default function MarketingDashboard({ stats, leads_by_source, performance_data }: Props) {
    const user = usePage().props.auth.user;
    const [timeRange, setTimeRange] = useState('This Month');

    const topKPIs = [
        { label: 'Total Spend', value: `SAR ${stats.total_spend.toLocaleString()}`, trend: '+12%', color: 'indigo', icon: DollarSign },
        { label: 'Total Leads', value: stats.total_leads.toLocaleString(), trend: '+8%', color: 'emerald', icon: Target },
        { label: 'Cost Per Lead', value: `SAR ${stats.cpl.toFixed(2)}`, trend: '-5%', color: 'orange', icon: Activity },
        { label: 'Active Campaigns', value: stats.active_campaigns, trend: '0%', color: 'blue', icon: Zap },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

    const channels = [
        { name: 'Meta Ads', value: 45, icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Google Ads', value: 25, icon: Globe, color: 'text-red-600', bg: 'bg-red-50' },
        { name: 'WhatsApp', value: 20, icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Influencers', value: 10, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                Marketing <span className="text-indigo-600">Overview</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">ROI & Performance Analytics</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-1 flex gap-1 shadow-sm">
                            {['7D', '30D', '90D', 'ALL'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setTimeRange(r)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                        timeRange === r ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <Link
                            href={route('marketing.campaigns.create')}
                            className="px-6 py-3.5 bg-[#FF5C00] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
                        >
                            <Plus className="w-4 h-4" /> Create Campaign
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Marketing Dashboard" />

            <div className="space-y-10 pb-20 mt-4">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topKPIs.map((kpi) => (
                        <div key={kpi.label} className="bg-white p-8 border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center",
                                        kpi.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                                            kpi.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                                kpi.color === 'orange' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        <kpi.icon className="w-6 h-6" />
                                    </div>
                                    <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black",
                                        kpi.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        {kpi.trend}
                                    </div>
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</h3>
                                <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-indigo-50/50 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lead Performance</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Daily acquisition trend</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Current Period
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performance_data}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Source Breakdown */}
                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10 flex flex-col">
                        <div className="mb-10 text-center">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Source Mix</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Lead Distribution</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leads_by_source.length > 0 ? leads_by_source : [{ source: 'No Data', count: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="count"
                                        nameKey="source"
                                    >
                                        {leads_by_source.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 space-y-4">
                            {leads_by_source.map((item, index) => (
                                <div key={item.source} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.source}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 uppercase">{item.count} Leads</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Channels & Conversion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Performing Channels */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-8 group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top Channels</h3>
                        </div>
                        <div className="space-y-6">
                            {channels.map((ch) => (
                                <div key={ch.name} className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", ch.bg, ch.color)}>
                                        <ch.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] font-black text-slate-900 uppercase">{ch.name}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{ch.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full transition-all duration-1000", ch.bg.replace('50', '500'))}
                                                style={{ width: `${ch.value}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Conversion Funnel Mockup */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                <Target className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Conversion Funnel</h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            {[
                                { stage: 'Impressions', value: '142K', percent: 100, color: 'bg-slate-900' },
                                { stage: 'Clicks', value: '12.4K', percent: 65, color: 'bg-indigo-600' },
                                { stage: 'Leads', value: '840', percent: 35, color: 'bg-emerald-500' },
                                { stage: 'Consultations', value: '152', percent: 15, color: 'bg-[#FF5C00]' },
                            ].map((s) => (
                                <div key={s.stage} className="relative">
                                    <div className={cn("h-10 rounded-xl flex items-center px-4 justify-between text-white font-black text-[10px] uppercase shadow-sm mx-auto transition-all", s.color)}
                                        style={{ width: `${s.percent}%` }}>
                                        <span>{s.stage}</span>
                                        <span>{s.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="bg-slate-900 rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Marketing <span className="text-orange-400">Toolkit</span></h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: 'Ad Builder', icon: Plus, color: 'bg-white/10' },
                                    { name: 'Media Lib', icon: Globe, color: 'bg-indigo-500' },
                                    { name: 'ROI Calc', icon: DollarSign, color: 'bg-[#FF5C00]' },
                                    { name: 'Integrations', icon: Settings2, color: 'bg-emerald-500' }
                                ].map((tool, i) => (
                                    <button key={i} className={cn("flex flex-col items-center justify-center p-6 rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95 border border-white/5", tool.color)}>
                                        <tool.icon className="w-5 h-5" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{tool.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-orange-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Pixel Status</p>
                                        <p className="text-[8px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-0.5">Active & Receiving Data</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/40" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Need to import Settings2 if used
import { Settings2 } from 'lucide-react';
