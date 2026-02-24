import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, ChevronLeft, ChevronRight, Download, List, Hourglass, Star, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import Drawer from '@/Components/Drawer';

interface Props {
    employees: any[];
    shifts: any[];
    rosters: any[];
    holidays: any[];
    startDate: string;
    endDate: string;
}

export default function Index({ employees, shifts, rosters, holidays, startDate, endDate }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isBulkMode, setIsBulkMode] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        employee_id: '' as number | string,
        shift_id: '' as string | number,
        dates: [] as string[]
    });

    const weekDates = useMemo(() => {
        const dates: string[] = [];
        let current = new Date(startDate + 'T12:00:00'); // avoid timezone off-by-one
        const end = new Date(endDate + 'T12:00:00');
        while (current <= end) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }, [startDate, endDate]);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const currentStart = new Date(startDate + 'T12:00:00');
        currentStart.setDate(currentStart.getDate() + (direction === 'next' ? 7 : -7));
        router.get(route('hr.roster.index'), { start_date: currentStart.toISOString().split('T')[0] }, { preserveState: true });
    };

    const openCell = (empId: number, date: string) => {
        const existing = getRoster(empId, date);
        setIsBulkMode(false);
        setData({ employee_id: empId, shift_id: existing?.shift_id || '', dates: [date] });
        setIsOpen(true);
    };

    const openBulk = () => {
        setIsBulkMode(true);
        setData({ employee_id: 'all', shift_id: '', dates: [] });
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.roster.store'), { onSuccess: close });
    };

    const getRoster = (empId: number, date: string) =>
        rosters.find((r: any) => r.employee_id === empId && r.date === date);

    const isHoliday = (date: string) => holidays.some((h: any) => h.date === date);

    const fmt = (d: string) => ({
        day: new Date(d + 'T12:00:00').getDate(),
        weekday: new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        month: new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    });

    const getWeekStr = () => {
        const s = new Date(startDate + 'T12:00:00');
        const e = new Date(endDate + 'T12:00:00');
        return `${s.getDate()} ${s.toLocaleDateString('en-US', { month: 'short' })} - ${e.getDate()} ${e.toLocaleDateString('en-US', { month: 'short' })}`;
    };

    const shiftColor = (name: string) => {
        const colors: any = {
            Morning: 'bg-amber-50 border-amber-200 text-amber-700',
            Evening: 'bg-violet-50 border-violet-200 text-violet-700',
            Night: 'bg-slate-800 border-slate-700 text-slate-100',
        };
        for (const key of Object.keys(colors)) {
            if (name?.includes(key)) return colors[key];
        }
        return 'bg-blue-50 border-blue-200 text-blue-700';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-3">
                        <select className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                            <option>Employee All</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.user?.name}</option>)}
                        </select>
                        <select className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                            <option>Department All</option>
                        </select>
                        <select className="h-9 px-3 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                            <option>Weekly View</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Shift Roster" />

            <div className="max-w-[1600px] mx-auto py-6">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex gap-2">
                        <button
                            onClick={openBulk}
                            className="h-9 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
                        >
                            <Plus className="w-4 h-4" /> Assign Bulk Shifts
                        </button>
                        <button className="h-9 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                    <div className="flex gap-1.5">
                        <button className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <List className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <Hourglass className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Calendar Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Card Header: week nav + legend */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => navigateWeek('prev')} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 border-r border-slate-200 text-slate-500 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-5 text-sm font-semibold text-slate-700 whitespace-nowrap">{getWeekStr()}</span>
                            <button onClick={() => navigateWeek('next')} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 border-l border-slate-200 text-slate-500 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            {shifts.map(s => (
                                <div key={s.id} className="flex items-center gap-1.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider border ${shiftColor(s.name)}`}>
                                        {s.name.substring(0, 2).toUpperCase()}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">: {s.name}</span>
                                </div>
                            ))}
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-blue-500 fill-blue-400" />
                                <span className="text-xs font-medium text-slate-500">: Holiday</span>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest text-slate-400 w-[230px]">Employee</th>
                                    {weekDates.map(date => {
                                        const { day, weekday, month } = fmt(date);
                                        const holiday = isHoliday(date);
                                        return (
                                            <th key={date} className={`py-4 text-center min-w-[110px] ${holiday ? 'bg-blue-50/60' : ''}`}>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className={`text-[22px] font-light leading-none ${holiday ? 'text-blue-600' : 'text-slate-600'}`}>{day}</span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${holiday ? 'text-blue-400' : 'text-slate-400'}`}>{weekday}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${holiday ? 'text-blue-300' : 'text-slate-300'}`}>{month}</span>
                                                    {holiday && <Star className="w-3 h-3 text-blue-400 fill-blue-300 mt-0.5" />}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, i) => (
                                    <tr key={emp.id} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/20'} hover:bg-blue-50/10 transition-colors`}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 ring-2 ring-white shadow-sm">
                                                    {emp.user?.name?.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-[13px] truncate">{emp.user?.name}</span>
                                            </div>
                                        </td>
                                        {weekDates.map(date => {
                                            const roster = getRoster(emp.id, date);
                                            const holiday = isHoliday(date);
                                            return (
                                                <td key={date} className={`py-2 px-1.5 text-center ${holiday ? 'bg-blue-50/30' : ''}`}>
                                                    {roster ? (
                                                        <button
                                                            onClick={() => openCell(emp.id, date)}
                                                            className={`w-[90px] h-[52px] border rounded-lg flex flex-col items-center justify-center mx-auto cursor-pointer hover:opacity-80 transition-opacity font-bold text-xs uppercase tracking-wider ${shiftColor(roster.shift?.name)}`}
                                                        >
                                                            <span className="text-[11px] font-black">{roster.shift?.name?.substring(0, 2)}</span>
                                                            <span className="text-[9px] font-medium opacity-70 mt-0.5">{roster.shift?.start_time?.substring(0, 5)}</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => openCell(emp.id, date)}
                                                            className="w-[90px] h-[52px] border border-dashed border-slate-200 rounded-lg flex items-center justify-center mx-auto cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                                <Plus className="w-3 h-3" />
                                                            </div>
                                                        </button>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={isOpen}
                onClose={close}
                title={isBulkMode ? 'Assign Bulk Shifts' : 'Assign Shift'}
                description={isBulkMode ? 'Assign shifts to one or all employees across multiple dates' : 'Click a shift to assign, or clear to mark as off'}
                maxWidth="max-w-md"
                footer={
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            form="roster-form"
                            disabled={processing || (isBulkMode && data.dates.length === 0)}
                            className="h-9 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 shadow-sm"
                        >
                            Save Assignment
                        </button>
                        <button type="button" onClick={close} className="h-9 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Cancel
                        </button>
                    </div>
                }
            >
                <form id="roster-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Bulk: Employee selector */}
                    {isBulkMode && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Assign To <span className="text-red-500">*</span></label>
                            <select
                                value={data.employee_id}
                                onChange={e => setData('employee_id', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                <option value="all">All Employees</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.user?.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Date checkboxes — bulk only */}
                    {isBulkMode && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Select Dates <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-2">
                                {weekDates.map(date => {
                                    const { day, weekday, month } = fmt(date);
                                    const holiday = isHoliday(date);
                                    const checked = data.dates.includes(date);
                                    return (
                                        <label
                                            key={date}
                                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${checked ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={e => {
                                                    const newDates = e.target.checked
                                                        ? [...data.dates, date]
                                                        : data.dates.filter(d => d !== date);
                                                    setData('dates', newDates);
                                                }}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-700">{month} {day}</div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{weekday.substring(0, 3)}</div>
                                            </div>
                                            {holiday && <Star className="w-3 h-3 text-blue-400 fill-blue-300 flex-shrink-0" />}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.dates && <p className="text-red-500 text-xs mt-2">{errors.dates}</p>}
                        </div>
                    )}

                    {/* Shift selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Select Shift</label>
                        <div className="space-y-2">
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${data.shift_id === '' ? 'border-slate-400 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" name="shift_id" value="" checked={data.shift_id === ''} onChange={() => setData('shift_id', '')} className="text-slate-600 focus:ring-slate-500" />
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">Off Day / Clear</div>
                                    <div className="text-[10px] text-slate-400">Remove existing shift assignment</div>
                                </div>
                            </label>
                            {shifts.map(s => {
                                const selected = String(data.shift_id) === String(s.id);
                                return (
                                    <label
                                        key={s.id}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="shift_id"
                                            value={s.id}
                                            checked={selected}
                                            onChange={() => setData('shift_id', s.id)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{s.start_time} – {s.end_time}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${shiftColor(s.name)}`}>
                                            {s.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        {errors.shift_id && <p className="text-red-500 text-xs mt-2">{errors.shift_id}</p>}
                    </div>
                </form>
            </Drawer>
        </AuthenticatedLayout>
    );
}
