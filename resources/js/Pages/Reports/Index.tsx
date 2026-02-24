import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Phone,
    MessageCircle,
    Calendar,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Download,
    Filter,
    Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    daily_stats: {
        calls: { received: number, answered: number, pending: number };
        messages: { received: number, replied: number, follow_up: number };
        appointments: { scheduled: number, completed: number };
    };
    campaign_performance: {
        name: string;
        leads: number;
        conversion_rate: string;
        roi: string;
    }[];
    counselor_comparison: {
        total: number;
        counselor: { name: string };
    }[];
}

export default function Index({ daily_stats, campaign_performance, counselor_comparison }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Analytics Hub
                        </h2>
                        <p className="text-slate-500 text-sm">Monitor clinic performance and marketing efficiency.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Reports & Analytics" />

            <div className="space-y-8 pb-12">
                {/* Status Overviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReportCard
                        title="Telephony Activity"
                        icon={Phone}
                        iconColor="text-blue-600 bg-blue-50"
                        stats={[
                            { label: 'Total Volume', value: daily_stats.calls.received, trend: '+12%', isUp: true },
                            { label: 'Answered', value: daily_stats.calls.answered, color: 'text-emerald-600' },
                            { label: 'Missed / Pending', value: daily_stats.calls.pending, color: 'text-rose-600' }
                        ]}
                    />
                    <ReportCard
                        title="Communication"
                        icon={MessageCircle}
                        iconColor="text-indigo-600 bg-indigo-50"
                        stats={[
                            { label: 'Messages Recv', value: daily_stats.messages.received, trend: '+5%', isUp: true },
                            { label: 'Response Rate', value: daily_stats.messages.replied, color: 'text-emerald-600' },
                            { label: 'Follow-ups', value: daily_stats.messages.follow_up, color: 'text-amber-600' }
                        ]}
                    />
                    <ReportCard
                        title="Patient Conversions"
                        icon={Calendar}
                        iconColor="text-purple-600 bg-purple-50"
                        stats={[
                            { label: 'Appointments', value: daily_stats.appointments.scheduled, trend: '+18%', isUp: true },
                            { label: 'Show Rate', value: daily_stats.appointments.completed, color: 'text-indigo-600' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Campaign Performance Chart (Visual Simulation) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Conversion by Campaign</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 space-y-8">
                                {campaign_performance.map((cp, i) => (
                                    <div key={i} className="space-y-3 group">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                                                    <Target className="w-3.5 h-3.5 text-slate-300" /> {cp.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{cp.leads} Total Leads</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-slate-900">{cp.conversion_rate}</div>
                                                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter shrink-0 flex items-center justify-end gap-0.5">
                                                    ROI {cp.roi} <ArrowUpRight className="w-2.5 h-2.5" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                                                style={{ width: cp.conversion_rate }}
                                            ></div>
                                            {/* Decorative hash marks */}
                                            <div className="absolute inset-0 opacity-[0.2] flex justify-between px-4 pointer-events-none">
                                                {[...Array(10)].map((_, i) => (
                                                    <div key={i} className="w-[1px] h-full bg-white/50"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {campaign_performance.length === 0 && (
                                    <div className="py-20 text-center">
                                        <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-medium text-slate-400">No active campaign data to visualize.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Counselor Ranking */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Users className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">Counselor Output</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {counselor_comparison.map((cc, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-dotted border-slate-200 hover:border-slate-300 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm group-hover:scale-110 transition-transform">
                                                    {i + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{cc.counselor?.name || 'Unassigned'}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total Managed</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-base font-black text-slate-900">{cc.total}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Leads</div>
                                            </div>
                                        </div>
                                    ))}
                                    {counselor_comparison.length === 0 && (
                                        <div className="text-center py-10">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No staff records found</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 p-5 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group shadow-lg shadow-indigo-100">
                                    <div className="relative z-10 flex flex-col gap-2">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200">System Insight</h4>
                                        <p className="text-xs font-medium leading-relaxed">Sara Counselor is currently leading with a 8.2% higher closing rate than the average.</p>
                                        <button className="mt-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group/btn">
                                            View Staff ROI <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                    <TrendingUp className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

interface ReportCardProps {
    title: string;
    icon: any;
    iconColor: string;
    stats: { label: string, value: number, color?: string, trend?: string, isUp?: boolean }[];
}

function ReportCard({ title, icon: Icon, iconColor, stats }: ReportCardProps) {
    return (
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-6", iconColor)}>
                    <Icon className="w-5 h-5" />
                </div>
                {stats[0].trend && (
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black",
                        stats[0].isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {stats[0].isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stats[0].trend}
                    </div>
                )}
            </div>

            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                {title}
            </h4>

            <div className="space-y-4">
                {stats.map((s, i) => (
                    <div key={i} className={cn(
                        "flex justify-between items-end",
                        i === 0 ? "border-b border-slate-50 pb-3 mb-1" : ""
                    )}>
                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                        <p className={cn(
                            "font-black leading-none",
                            i === 0 ? "text-2xl text-slate-900" : cn("text-lg", s.color || 'text-slate-700')
                        )}>{s.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
