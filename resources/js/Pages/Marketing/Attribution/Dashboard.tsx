import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Target,
    ArrowUpRight,
    Search,
    Funnel,
    Filter,
    BarChart3,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';

interface AttributionData {
    utm_source: string | null;
    count: number;
}

interface Props {
    attribution_data: AttributionData[];
}

export default function AttributionDashboard({ attribution_data }: Props) {
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

    const formattedData = attribution_data.map(d => ({
        source: d.utm_source || 'Direct/Unknown',
        value: d.count
    }));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Lead <span className="text-indigo-600">Attribution</span>
                        </h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">Discover where your patients come from</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Filter className="w-4 h-4 text-slate-400" /> Advanced Filter
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Attribution Dashboard" />

            <div className="mt-8 space-y-8 max-w-[1400px] mx-auto">
                {/* Visualizations Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Source Breakdown Pie */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10 flex flex-col">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lead Volume by Source</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">UTM Source Analysis</p>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={formattedData.length > 0 ? formattedData : [{ source: 'No Data', value: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        nameKey="source"
                                    >
                                        {formattedData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {formattedData.map((item, index) => (
                                <div key={item.source} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{item.source}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 ml-4">{item.value} Leads</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Funnel Mockup */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-10 flex flex-col">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Macro Conversion Funnel</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Click to Appointment</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            {[
                                { stage: 'Ad Clicks', value: '14,204', width: '100%', bg: 'bg-slate-900', text: 'text-white' },
                                { stage: 'Landing Page Views', value: '11,400', width: '85%', bg: 'bg-indigo-600', text: 'text-white' },
                                { stage: 'Total Leads Captured', value: '2,840', width: '60%', bg: 'bg-indigo-500', text: 'text-white' },
                                { stage: 'Contacted Leads', value: '1,950', width: '45%', bg: 'bg-indigo-400', text: 'text-white' },
                                { stage: 'Appointments Booked', value: '420', width: '25%', bg: 'bg-emerald-500', text: 'text-white' },
                                { stage: 'Consultations Done', value: '315', width: '18%', bg: 'bg-[#FF5C00]', text: 'text-white' },
                            ].map((funnel) => (
                                <div key={funnel.stage} className="relative group">
                                    <div
                                        className={cn("h-12 rounded-2xl flex items-center justify-between px-6 transition-all duration-700 ease-out mx-auto shadow-sm", funnel.bg, funnel.text)}
                                        style={{ width: funnel.width }}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[60%]">{funnel.stage}</span>
                                        <span className="text-sm font-black tracking-tight">{funnel.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Automation Prompt */}
                <Link href={route('marketing.automation.index')} className="block bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-10 overflow-hidden relative group hover:border-indigo-500 transition-colors">
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Automate Attribution & Tagging</h3>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Set up rules to map leads directly to correct campaigns</p>
                        </div>
                        <div className="px-6 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl group-hover:scale-105 active:scale-95 transition-all">
                            Configure Rules <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
