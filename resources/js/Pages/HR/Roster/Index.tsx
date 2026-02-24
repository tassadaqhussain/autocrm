import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Download, List, Hourglass, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    employees: any[];
    shifts: any[];
    rosters: any[];
    holidays: any[];
    startDate: string;
    endDate: string;
}

export default function Index({ employees, shifts, rosters, holidays, startDate, endDate }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>('all');

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        employee_id: 'all' as number | 'all',
        shift_id: '' as string | number, // empty means clear
        dates: [] as string[]
    });

    // Generate array of dates for the current week
    const weekDates = useMemo(() => {
        const dates = [];
        let current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }, [startDate, endDate]);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const currentStart = new Date(startDate);
        currentStart.setDate(currentStart.getDate() + (direction === 'next' ? 7 : -7));
        router.get(route('hr.roster.index'), { start_date: currentStart.toISOString().split('T')[0] }, { preserveState: true });
    };

    const handleAssignClick = (empId: number | 'all', date: string) => {
        setData({
            employee_id: empId,
            shift_id: '',
            dates: [date]
        });
        setIsModalOpen(true);
    };

    const handleBulkAssign = () => {
        setData({
            employee_id: 'all',
            shift_id: '',
            dates: []
        });
        setIsModalOpen(true);
    };

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hr.roster.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const getRoster = (empId: number, date: string) => {
        return rosters.find(r => r.employee_id === empId && r.date === date);
    };

    const isHoliday = (date: string) => {
        return holidays.some(h => h.date === date);
    };

    const getDayName = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    };

    const getDayNumber = (dateStr: string) => {
        return new Date(dateStr).getDate();
    };

    const getMonthName = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    };

    const getWeekRangeStr = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <select className="h-9 px-3 border border-slate-300 rounded text-sm bg-white font-medium text-slate-700 focus:ring-1 focus:ring-blue-500">
                            <option>Employee All</option>
                        </select>
                        <select className="h-9 px-3 border border-slate-300 rounded text-sm bg-white font-medium text-slate-700 focus:ring-1 focus:ring-blue-500">
                            <option>Department All</option>
                        </select>
                        <select className="h-9 px-3 border border-slate-300 rounded text-sm bg-white font-medium text-slate-700 focus:ring-1 focus:ring-blue-500">
                            <option>Weekly View</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Shift Roster" />

            <div className="max-w-[1600px] mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                        <button onClick={handleBulkAssign} className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Assign Bulk Shifts
                        </button>
                        <button className="h-10 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50">
                            <List className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50">
                            <Hourglass className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => navigateWeek('prev')} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 border-r border-slate-200 text-slate-600 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="px-6 font-semibold text-slate-800 text-sm whitespace-nowrap">
                                {getWeekRangeStr()}
                            </div>
                            <button onClick={() => navigateWeek('next')} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 border-l border-slate-200 text-slate-600 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex gap-4 items-center">
                            {shifts.map(s => (
                                <div key={s.id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase font-bold tracking-wider">{s.name.substring(0, 2)}</span>
                                    : {s.name}
                                </div>
                            ))}
                            <div className="w-px h-4 bg-slate-300 mx-2"></div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                <Star className="w-4 h-4 text-blue-600 fill-blue-600" /> : Holiday
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-4 py-4 font-bold text-slate-500 uppercase tracking-widest text-[11px] w-[250px] border-b border-slate-200 bg-slate-50/50">Employee</th>
                                    {weekDates.map(date => (
                                        <th key={date} className="px-2 py-4 border-b border-slate-200 bg-slate-50/50 text-center min-w-[100px]">
                                            <div className="flex flex-col items-center">
                                                <span className="text-2xl font-light text-slate-700">{getDayNumber(date)}</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {getDayName(date)}<br />{getMonthName(date)}
                                                </span>
                                                {isHoliday(date) && <Star className="w-3 h-3 text-blue-600 fill-blue-600 mt-1" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
                                                    {emp.user?.name.charAt(0)}
                                                </div>
                                                <div className="font-semibold text-slate-800 text-[13px]">{emp.user?.name}</div>
                                            </div>
                                        </td>
                                        {weekDates.map(date => {
                                            const roster = getRoster(emp.id, date);
                                            return (
                                                <td key={date} className="px-2 py-2">
                                                    <div className="flex justify-center">
                                                        {roster ? (
                                                            <button
                                                                onClick={() => handleAssignClick(emp.id, date)}
                                                                className="w-[85px] h-[55px] border border-blue-200 bg-blue-50/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group relative"
                                                            >
                                                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase font-bold tracking-wider">{roster.shift?.name?.substring(0, 2)}</span>
                                                                <span className="text-[10px] text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">Edit</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAssignClick(emp.id, date)}
                                                                className="w-[85px] h-[55px] border border-slate-200 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors group"
                                                            >
                                                                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                    <Plus className="w-4 h-4" />
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
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

            <Modal show={isModalOpen} onClose={() => { setIsModalOpen(false); reset(); }} maxWidth="md">
                <form onSubmit={submitAssignment} className="bg-white">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800">Assign Shift</h2>
                    </div>

                    <div className="p-6 space-y-5">
                        {data.employee_id === 'all' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Dates <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-2">
                                    {weekDates.map(date => (
                                        <label key={date} className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50 text-sm">
                                            <input
                                                type="checkbox"
                                                value={date}
                                                checked={data.dates.includes(date)}
                                                onChange={e => {
                                                    const newDates = e.target.checked
                                                        ? [...data.dates, date]
                                                        : data.dates.filter(d => d !== date);
                                                    setData('dates', newDates);
                                                }}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </label>
                                    ))}
                                </div>
                                {errors.dates && <p className="text-red-500 text-xs mt-1">{errors.dates}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Shift <span className="text-red-500">*</span></label>
                            <select
                                value={data.shift_id}
                                onChange={e => setData('shift_id', e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            >
                                <option value="">-- Clear Shift (Off Day) --</option>
                                {shifts.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.end_time})</option>
                                ))}
                            </select>
                            {errors.shift_id && <p className="text-red-500 text-xs mt-1">{errors.shift_id}</p>}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                        <button
                            type="button"
                            onClick={() => { setIsModalOpen(false); reset(); }}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || (data.employee_id === 'all' && data.dates.length === 0)}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Save Shift Assignment
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
