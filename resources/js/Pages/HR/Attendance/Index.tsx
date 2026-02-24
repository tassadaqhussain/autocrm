import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Download, Upload, List, User, Star, Check, Clock, X, Minus, Plane } from 'lucide-react';
import { useState, useMemo } from 'react';
import Drawer from '@/Components/Drawer';

interface Props {
    employees: any[];
    logs: Record<string, any[]>;
    holidays: string[];
    daysInMonth: number;
    month: number;
    year: number;
    stats: any;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Status config
const STATUS_CONFIG: Record<string, { label: string; icon: any; cell: string; dot: string }> = {
    Present: { label: 'Present', icon: Check, cell: 'text-emerald-600', dot: 'bg-emerald-500' },
    Late: { label: 'Late', icon: Clock, cell: 'text-amber-500', dot: 'bg-amber-400' },
    'Half Day': { label: 'Half Day', icon: Minus, cell: 'text-blue-500', dot: 'bg-blue-400' },
    Absent: { label: 'Absent', icon: X, cell: 'text-red-500', dot: 'bg-red-500' },
    'On Leave': { label: 'On Leave', icon: Plane, cell: 'text-purple-500', dot: 'bg-purple-400' },
};

export default function Index({ employees, logs, holidays, daysInMonth, month, year, stats }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [filterEmp, setFilterEmp] = useState('all');

    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        clock_in_ip: '127.0.0.1',
        clock_out_ip: '127.0.0.1',
        is_late: false as boolean,
        is_half_day: false as boolean,
        location: 'Worksuite',
        working_from: 'Office',
    });

    // Build the days array for current month
    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(year, month - 1, i + 1);
            return {
                day: i + 1,
                dayName: DAY_NAMES[d.getDay()],
                date: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
                isWeekend: d.getDay() === 0 || d.getDay() === 6,
            };
        });
    }, [daysInMonth, month, year]);

    const getLog = (empId: number, date: string) => {
        const key = `${empId}_${date}`;
        return logs[key]?.[0] ?? null;
    };

    const isHoliday = (date: string) => holidays.includes(date);

    const navigateMonth = (dir: number) => {
        let newMonth = month + dir;
        let newYear = year;
        if (newMonth < 1) { newMonth = 12; newYear--; }
        if (newMonth > 12) { newMonth = 1; newYear++; }
        router.get(route('hr.attendance.index'), { month: newMonth, year: newYear }, { preserveState: true });
    };

    const openMark = (empId?: number, date?: string) => {
        reset();
        if (empId) setData(d => ({ ...d, employee_id: String(empId) }));
        if (date) setData(d => ({ ...d, date }));
        setIsOpen(true);
    };

    const submitMark = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.attendance.mark'), { onSuccess: () => { setIsOpen(false); reset(); } });
    };

    const filteredEmployees = filterEmp === 'all' ? employees : employees.filter(e => String(e.id) === filterEmp);

    const renderCell = (empId: number, day: { date: string; isWeekend: boolean }) => {
        const log = getLog(empId, day.date);
        const holiday = isHoliday(day.date);

        if (holiday) {
            return (
                <button onClick={() => openMark(empId, day.date)} className="w-full h-full flex items-center justify-center" title="Holiday">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
                </button>
            );
        }

        if (day.isWeekend && !log) {
            return <span className="text-slate-300 text-xs">-</span>;
        }

        if (!log) {
            return (
                <button
                    onClick={() => openMark(empId, day.date)}
                    title="Mark Attendance"
                    className="w-full h-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            );
        }

        const cfg = STATUS_CONFIG[log.status] ?? STATUS_CONFIG.Present;
        const Icon = cfg.icon;
        return (
            <button
                onClick={() => openMark(empId, day.date)}
                title={`${log.status} — In: ${log.check_in ? log.check_in.substring(11, 16) : '--'}`}
                className={`w-full h-full flex items-center justify-center ${cfg.cell} hover:opacity-70 transition-opacity`}
            >
                <Icon className="w-3.5 h-3.5" />
            </button>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Attendance</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <span>Home</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-600 font-semibold">Attendance</span>
                    </div>
                </div>
            }
        >
            <Head title="Attendance" />

            <div className="max-w-[1600px] mx-auto py-6 space-y-5">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Employees', value: stats.total_employees, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
                        { label: 'Present Today', value: stats.present_today, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                        { label: 'Late Today', value: stats.late_today, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                        { label: 'Absent Today', value: stats.absent_today, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                    ].map(card => (
                        <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
                            <p className={`text-3xl font-black mt-1 ${card.color}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters + Actions */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <select
                            value={filterEmp}
                            onChange={e => setFilterEmp(e.target.value)}
                            className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Employee All</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.user?.name}</option>)}
                        </select>
                        <select className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500">
                            <option>Department All</option>
                        </select>
                        <select className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500">
                            <option>Designation All</option>
                        </select>
                        {/* Month/Year nav */}
                        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden h-9">
                            <button onClick={() => navigateMonth(-1)} className="px-2 h-full bg-white hover:bg-slate-50 text-slate-500 border-r border-slate-200 text-xs font-bold">‹</button>
                            <span className="px-3 text-sm font-semibold text-slate-700 whitespace-nowrap">{MONTHS[month - 1]}</span>
                            <button onClick={() => navigateMonth(1)} className="px-2 h-full bg-white hover:bg-slate-50 text-slate-500 border-l border-slate-200 text-xs font-bold">›</button>
                        </div>
                        <select
                            defaultValue={year}
                            onChange={e => router.get(route('hr.attendance.index'), { month, year: e.target.value }, { preserveState: true })}
                            className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500"
                        >
                            {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => openMark()} className="h-9 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200">
                            <Plus className="w-4 h-4" /> Mark Attendance
                        </button>
                        <button className="h-9 px-3 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Import
                        </button>
                        <button className="h-9 px-3 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button className="w-9 h-9 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50">
                            <List className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50">
                            <User className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl px-5 py-3">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mr-2">Note:</span>
                    {[
                        { label: 'Holiday', icon: Star, color: 'text-amber-400' },
                        { label: 'Day Off', icon: Minus, color: 'text-slate-400' },
                        { label: 'Present', icon: Check, color: 'text-emerald-500' },
                        { label: 'Half Day', icon: Minus, color: 'text-blue-500' },
                        { label: 'Late', icon: Clock, color: 'text-amber-500' },
                        { label: 'Absent', icon: X, color: 'text-red-500' },
                        { label: 'On Leave', icon: Plane, color: 'text-purple-500' },
                    ].map(({ label, icon: Icon, color }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
                        </span>
                    ))}
                </div>

                {/* Calendar Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="border-collapse text-xs" style={{ minWidth: `${230 + daysInMonth * 38}px` }}>
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    <th className="sticky left-0 z-10 bg-slate-50/90 backdrop-blur px-4 py-3 text-left font-black uppercase text-[10px] tracking-widest text-slate-500 border-r border-slate-200 w-[210px]">
                                        Employee
                                    </th>
                                    {days.map(d => (
                                        <th
                                            key={d.date}
                                            className={`w-[36px] py-3 text-center ${d.isWeekend ? 'bg-slate-100/60' : ''} ${isHoliday(d.date) ? 'bg-amber-50' : ''}`}
                                        >
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className={`font-black text-[11px] ${d.isWeekend ? 'text-slate-400' : 'text-slate-700'} ${isHoliday(d.date) ? '!text-amber-500' : ''}`}>{d.day}</span>
                                                <span className={`font-bold text-[9px] uppercase ${d.isWeekend ? 'text-slate-300' : 'text-slate-300'}`}>{d.dayName}</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right font-black uppercase text-[10px] tracking-widest text-slate-500 border-l border-slate-200 whitespace-nowrap w-[70px]">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, idx) => {
                                    const presentCount = days.filter(d => {
                                        const log = getLog(emp.id, d.date);
                                        return log && (log.status === 'Present' || log.status === 'Late' || log.status === 'Half Day');
                                    }).length;

                                    return (
                                        <tr key={emp.id} className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/20 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                                            <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-slate-200">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-[11px] flex-shrink-0 ring-2 ring-white shadow-sm">
                                                        {emp.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-800 text-[12px] block leading-tight">{emp.user?.name}</span>
                                                        {emp.shift?.name && (
                                                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wide">{emp.shift.name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {days.map(d => (
                                                <td
                                                    key={d.date}
                                                    className={`text-center h-10 p-0 ${d.isWeekend ? 'bg-slate-50/60' : ''} ${isHoliday(d.date) ? 'bg-amber-50/60' : ''}`}
                                                >
                                                    {renderCell(emp.id, d)}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-right border-l border-slate-100">
                                                <span className="font-black text-slate-700 text-[13px]">{presentCount}</span>
                                                <span className="text-slate-300 font-bold text-[11px]">/{daysInMonth}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mark Attendance Drawer */}
            <Drawer
                isOpen={isOpen}
                onClose={() => { setIsOpen(false); reset(); }}
                title="Mark Attendance"
                description="Record employee clock-in details"
                maxWidth="max-w-lg"
                footer={
                    <div className="flex items-center gap-4">
                        <button type="submit" form="attendance-form" disabled={processing}
                            className="h-9 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                            <Check className="w-4 h-4" /> Save
                        </button>
                        <button type="button" onClick={() => { setIsOpen(false); reset(); }}
                            className="h-9 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Close
                        </button>
                    </div>
                }
            >
                <form id="attendance-form" onSubmit={submitMark} className="space-y-6">
                    {/* Employee */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Employee <span className="text-red-500">*</span></label>
                        <select value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                            <option value="" disabled>-- Select Employee --</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.user?.name}</option>)}
                        </select>
                        {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Date <span className="text-red-500">*</span></label>
                        <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>

                    {/* Clock In / IP / Late */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Clock In <span className="text-red-500">*</span></label>
                            <input type="time" value={data.check_in} onChange={e => setData('check_in', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            {errors.check_in && <p className="text-red-500 text-xs mt-1">{errors.check_in}</p>}
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Clock In IP</label>
                            <input type="text" value={data.clock_in_ip} onChange={e => setData('clock_in_ip', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Late</label>
                            <button type="button" onClick={() => setData('is_late', !data.is_late)}
                                className={`mt-1 relative w-10 h-5 rounded-full transition-colors ${data.is_late ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_late ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Clock Out / IP / Half Day */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Clock Out</label>
                            <input type="time" value={data.check_out} onChange={e => setData('check_out', e.target.value)}
                                placeholder="e.g. 10:00"
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Clock Out IP</label>
                            <input type="text" value={data.clock_out_ip} onChange={e => setData('clock_out_ip', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Half Day</label>
                            <button type="button" onClick={() => setData('is_half_day', !data.is_half_day)}
                                className={`mt-1 relative w-10 h-5 rounded-full transition-colors ${data.is_half_day ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_half_day ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Location / Working From */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Location</label>
                            <select value={data.location} onChange={e => setData('location', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option>Worksuite</option>
                                <option>Main Branch</option>
                                <option>Downtown</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Working From <span className="text-red-500">*</span></label>
                            <select value={data.working_from} onChange={e => setData('working_from', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option>Office</option>
                                <option>Home</option>
                                <option>Remote</option>
                                <option>Field</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
