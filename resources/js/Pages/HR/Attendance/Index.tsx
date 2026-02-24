import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, CheckCircle2, LogOut, Calendar as CalendarIcon, Building2, UserCheck, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
    employee: any;
    todayLog: any;
    recentLogs: any[];
    stats: any;
}

export default function Index({ employee, todayLog, recentLogs, stats }: Props) {
    const checkInForm = useForm({});
    const checkOutForm = useForm({});

    const handleCheckIn = () => {
        checkInForm.post(route('hr.attendance.check-in'));
    };

    const handleCheckOut = () => {
        checkOutForm.post(route('hr.attendance.check-out'));
    };

    const currentTime = format(new Date(), 'HH:mm');
    const currentDate = format(new Date(), 'EEEE, do MMMM yyyy');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Work Terminal</h2>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Attendance & Timesheets</span>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Terminal" />

            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
                {/* Left Panel: The Clock-in Hub */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Clock className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{currentDate}</p>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">{currentTime}</h1>
                            </div>

                            <div className="space-y-4">
                                {!todayLog?.check_in ? (
                                    <button
                                        onClick={handleCheckIn}
                                        disabled={checkInForm.processing}
                                        className="w-full h-16 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                                    >
                                        <Timer className="w-5 h-5" /> Start Shift
                                    </button>
                                ) : !todayLog?.check_out ? (
                                    <div className="space-y-3">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase">Operational Status</p>
                                                <p className="text-xs font-bold text-emerald-900 italic">Active Shift</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase italic">In</p>
                                                <p className="text-xs font-black text-emerald-900">{format(new Date(todayLog.check_in), 'HH:mm')}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCheckOut}
                                            disabled={checkOutForm.processing}
                                            className="w-full h-16 bg-rose-500 text-white rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-lg"
                                        >
                                            <LogOut className="w-5 h-5" /> End Shift
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 text-center space-y-3">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-900 uppercase italic">Operational Cycle Complete</p>
                                            <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Timesheet signed & recorded.</p>
                                        </div>
                                        <div className="flex justify-between px-2 border-t border-slate-200 pt-3 mt-3">
                                            <div className="text-left">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Entry</p>
                                                <p className="text-[11px] font-black text-slate-900">{format(new Date(todayLog.check_in), 'HH:mm')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exit</p>
                                                <p className="text-[11px] font-black text-slate-900">{format(new Date(todayLog.check_out), 'HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {stats?.total_employees > 0 && (
                        <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Global Pulse</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-0.5">
                                    <p className="text-xl font-bold italic">{stats.present_today}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">On Duty</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xl font-bold italic">{stats.total_employees - stats.present_today}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Off Duty</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Timesheets */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest italic">Personal Operation Logs</h3>
                            <button className="p-1.5 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-3 italic">Reference Date</th>
                                        <th className="px-6 py-3 italic">Clock In</th>
                                        <th className="px-6 py-3 italic">Clock Out</th>
                                        <th className="px-6 py-3 italic">Status</th>
                                        <th className="px-6 py-3 text-right">E-Sign</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentLogs?.length > 0 ? recentLogs.map((log) => (
                                        <tr key={log.id} className="text-[11px] group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-700">{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                                            <td className="px-6 py-4 font-black text-slate-900">{log.check_in ? format(new Date(log.check_in), 'HH:mm') : '--:--'}</td>
                                            <td className="px-6 py-4 font-black text-slate-900">{log.check_out ? format(new Date(log.check_out), 'HH:mm') : '--:--'}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                                                    log.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                )}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <UserCheck className="w-3.5 h-3.5 text-slate-200 ml-auto group-hover:text-emerald-500 transition-colors" />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <Timer className="w-8 h-8 mx-auto opacity-10 mb-2" />
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Archive Empty</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
