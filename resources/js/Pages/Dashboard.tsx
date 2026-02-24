import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    TrendingUp,
    CalendarCheck2,
    Clock,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Zap,
    Activity,
    Calendar,
    LayoutGrid,
    MoreHorizontal,
    Maximize2,
    DollarSign,
    Target,
    MousePointer2,
    ArrowUp,
    ArrowDown,
    Settings2,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

interface Stat {
    total_leads: number;
    new_leads: number;
    appointments: number;
    active_campaigns: number;
}

interface Props {
    stats: Stat;
}

export default function Dashboard({ stats }: Props) {
    const user = usePage().props.auth.user;
    const [timeRange, setTimeRange] = useState('This Month');

    const topKPIs = [
        { label: 'Patient Conversion', value: '23.4%', trend: '+12%', sub: 'vs last month', color: 'emerald' },
        { label: 'Total Assessments', value: '1,849', trend: '+3%', sub: 'vs last month', color: 'emerald' },
        { label: 'Average Revenue', value: 'SAR 15,239', trend: '+8%', sub: 'vs last month', color: 'emerald' },
        { label: 'Acquisition Cost', value: 'SAR 2,034', trend: '-3%', sub: 'vs last month', color: 'rose' },
    ];

    const treatments = [
        { name: 'Rhinoplasty Premium', sales: '8,172', price: 'SAR 25k', color: 'bg-orange-500', width: '85%' },
        { name: 'Weight Loss Program', sales: '6,345', price: 'SAR 12k', color: 'bg-purple-500', width: '70%' },
        { name: 'Botox Cosmetic', sales: '3,287', price: 'SAR 4k', color: 'bg-indigo-500', width: '45%' },
        { name: 'HydraFacial 360', sales: '2,456', price: 'SAR 1.5k', color: 'bg-emerald-500', width: '35%' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">
                                Hey, {user.name.split(' ')[0]} <span className="animate-pulse">👋</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-sm">
                            <button
                                onClick={() => setTimeRange('This Month')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    timeRange === 'This Month' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                <Calendar className="w-3.5 h-3.5" /> This Month
                            </button>
                            <button
                                onClick={() => setTimeRange('Last Month')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    timeRange === 'Last Month' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                <Activity className="w-3.5 h-3.5" /> Compare: Last Month
                            </button>
                        </div>
                        <button className="px-6 py-3.5 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                            <Settings2 className="w-4 h-4" /> Edit Widget
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">

                {/* Top KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topKPIs.map((kpi) => (
                        <div key={kpi.label} className="bg-white p-10 border border-slate-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                            <div className="flex flex-col gap-1 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                        {kpi.label.includes('Conversion') ? <Target className="w-5 h-5 text-indigo-600" /> :
                                            kpi.label.includes('Assessment') ? <Users className="w-5 h-5 text-blue-600" /> :
                                                kpi.label.includes('Revenue') ? <DollarSign className="w-5 h-5 text-emerald-600" /> :
                                                    <Clock className="w-5 h-5 text-rose-600" />}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{kpi.value}</span>
                                    <div className={cn(
                                        "flex items-center gap-1 text-[11px] font-black uppercase tracking-widest",
                                        kpi.color === 'emerald' ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {kpi.trend.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                        {kpi.trend}
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{kpi.sub}</p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Total Patients Chart */}
                    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm p-10 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Total Patients</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 flex gap-3 text-emerald-500">
                                        SAR 94,127 <span className="flex items-center gap-1 text-[9px]"><ArrowUp className="w-3 h-3" /> 9% vs last month</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div> This month
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Last month
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 underline underline-offset-8 decoration-slate-100 hover:decoration-indigo-600 px-2">View More</button>
                                    <button className="p-2.5 rounded-xl border border-slate-100 text-slate-300 hover:text-slate-900 transition-all"><Maximize2 className="w-4 h-4" /></button>
                                    <button className="p-2.5 rounded-xl border border-slate-100 text-slate-300 hover:text-slate-900 transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Line Chart Placeholder (SVG) */}
                        <div className="h-[300px] w-full mt-10 relative">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                                {/* Grid Lines */}
                                {[0, 1, 2, 3, 4, 5].map(i => (
                                    <line key={i} x1="0" y1={300 - i * 60} x2="1000" y2={300 - i * 60} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                                ))}

                                {/* Last Month Line (Faded) */}
                                <path
                                    d="M0 250 Q 100 260 200 180 T 400 200 T 600 240 T 800 180 T 1000 220"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                {/* This Month Line */}
                                <path
                                    d="M0 200 Q 100 150 200 220 T 400 180 T 600 120 T 800 200 T 1000 140"
                                    fill="none"
                                    stroke="#0f172a"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />

                                {/* Gradient Sweep */}
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </linearGradient>
                                <path
                                    d="M0 200 Q 100 150 200 220 T 400 180 T 600 120 T 800 200 T 1000 140 L 1000 300 L 0 300 Z"
                                    fill="url(#chartGrad)"
                                />
                            </svg>

                            {/* Bottom Labels */}
                            <div className="flex justify-between items-center mt-8 px-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {['Feb 01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '28'].map(d => (
                                    <span key={d}>{d}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Popular Treatment Progress */}
                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] shadow-sm p-10 group">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <LayoutGrid className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Popular Service</h3>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-10 group-hover:space-y-12 transition-all duration-500">
                            {treatments.map((t) => (
                                <div key={t.name} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{t.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t.sales} Invoiced</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t.price}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden flex">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-[1.5s] ease-out", t.color)}
                                            style={{ width: t.width }}
                                        >
                                            <div className="w-full h-full bg-black/10 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14 pt-8 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Real-time treatments analytics</span>
                            <button className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-1 group/link">
                                Detailed Report <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row Charts */}
                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] shadow-sm p-10 relative overflow-hidden h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-amber-500" /> Average Revenue Value
                            </h3>
                            <button className="p-2 text-slate-300 hover:text-slate-900"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900">SAR 15,239</span>
                                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
                                    <ArrowUp className="w-3.5 h-3.5" /> 2.4%
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">vs last month</p>
                        </div>

                        {/* Bar Chart Mockup */}
                        <div className="flex items-end justify-between h-[180px] gap-2 mt-12 px-2 relative">
                            {/* Avg Horizontal Line */}
                            <div className="absolute top-1/2 left-0 right-0 border-t border-slate-200 border-dashed z-0">
                                <div className="bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded w-fit -mt-3 relative z-10">Avg</div>
                            </div>
                            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 1.0, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.7].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-50 rounded-lg group/bar relative">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-lg transition-all duration-1000 ease-out delay-[calc(i*50ms)]"
                                        style={{ height: `${h * 100}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] shadow-sm p-10 relative overflow-hidden h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Average Sales
                            </h3>
                            <button className="p-2 text-slate-300 hover:text-slate-900"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900">840 Leads</span>
                                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
                                    <ArrowUp className="w-3.5 h-3.5" /> 1.34%
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">vs last month</p>
                        </div>

                        <div className="h-[180px] w-full mt-10 relative">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 180">
                                <path
                                    d="M0 150 Q 50 160 100 80 T 200 100 T 300 140 T 400 80"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M0 100 Q 50 50 100 120 T 200 80 T 300 20 T 400 40"
                                    fill="none"
                                    stroke="#ec6a11"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] shadow-sm p-10 relative overflow-hidden h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Zap className="w-4 h-4 text-indigo-500" /> Lead Response Time
                            </h3>
                            <button className="p-2 text-slate-300 hover:text-slate-900"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900">11m 40s</span>
                                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
                                    <ArrowDown className="w-3.5 h-3.5" /> 4% faster
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">vs last month</p>
                        </div>

                        {/* Vertical Bar Chart Mockup */}
                        <div className="flex items-end justify-between h-[180px] gap-3 mt-12 px-2">
                            {[0.6, 0.4, 0.8, 0.5, 0.7, 0.3, 0.9, 0.4, 0.6, 1.0, 0.5, 0.8, 0.4, 0.6].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-100 rounded-full group/bar relative h-full">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-[#6366f1] rounded-full transition-all duration-1000 ease-out"
                                        style={{ height: `${h * 100}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
