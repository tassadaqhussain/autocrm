import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    CalendarX,
    Clock,
    DollarSign,
    TrendingUp,
    Award,
    Briefcase,
    Building2,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    stats: {
        total_employees: number;
        active_employees: number;
        on_leave: number;
        pending_leaves: number;
    }
}

export default function Dashboard({ stats }: Props) {
    const kpis = [
        { label: 'Total Capital', value: stats.total_employees, icon: Users, color: 'bg-indigo-600', trend: '+2', trendType: 'up' },
        { label: 'Present Today', value: stats.active_employees, icon: UserCheck, color: 'bg-emerald-500', trend: '98%', trendType: 'up' },
        { label: 'On Leave', value: stats.on_leave, icon: CalendarX, color: 'bg-amber-500', trend: '-1', trendType: 'down' },
        { label: 'Avg Shift', value: '8.5h', icon: Clock, color: 'bg-rose-500', trend: 'Optimal', trendType: 'up' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            HR Intelligence <span className="text-slate-200">/</span> Dashboard
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2 ml-1">Strategic Human Resource Management System</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                            Export Analytics
                        </button>
                        <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                            <Plus className="w-4 h-4" /> Manage Workforce
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="HR Dashboard" />

            <div className="space-y-10">
                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-8">
                    {kpis.map((kpi, i) => (
                        <div key={i} className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full", kpi.color)} />

                            <div className="flex justify-between items-start relative z-10">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl", kpi.color)}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1",
                                    kpi.trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                )}>
                                    {kpi.trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {kpi.trend}
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                                View Detailed Report
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Recruitment Pipeline */}
                    <div className="col-span-2 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Operations Distribution</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Staff allocation across active clinic wings.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-400">Monthly</span>
                                <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase">Weekly</span>
                            </div>
                        </div>
                        <div className="p-10 flex-1 min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TrendingUp className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-relaxed">Intelligence Data Pending<br />Continue onboarding staff to generate charts.</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access / Actions */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <Award className="absolute right-[-10px] bottom-[-10px] w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Payroll Terminal</h4>
                            <p className="text-xs text-white/60 font-medium leading-relaxed mb-8">Generate and approve payslips for the current cycle. Next run in 4 days.</p>
                            <button className="w-full py-4 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Execute Payroll Run
                            </button>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 px-2 italic">Active Initiatives</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Q1 Perforance Review', date: 'March 15', icon: Award, color: 'text-amber-500' },
                                    { label: 'Policy Update - PTO', date: 'March 20', icon: Building2, color: 'text-blue-500' },
                                    { label: 'Health Insurance Renew', date: 'March 28', icon: Award, color: 'text-emerald-500' },
                                ].map((task, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", task.color)}>
                                            <task.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{task.label}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{task.date}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
