<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\AttendanceLog;
use App\Models\HR\Employee;
use App\Models\HR\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $clinicId = $user->clinic_id;

        $month = $request->integer('month', Carbon::now()->month);
        $year  = $request->integer('year', Carbon::now()->year);

        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth();
        $daysInMonth  = $endOfMonth->day;

        // All active employees for this clinic
        $employees = Employee::with('user:id,name')->where('clinic_id', $clinicId)->where('status', 'Active')->get();

        // All attendance logs for this month
        $logs = AttendanceLog::whereIn('employee_id', $employees->pluck('id'))
            ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
            ->get()
            ->groupBy(fn($l) => "{$l->employee_id}_{$l->date}");

        // Holidays this month
        $holidays = Holiday::where('clinic_id', $clinicId)
            ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
            ->pluck('date')
            ->toArray();

        // Stats
        $today = Carbon::today()->toDateString();
        $stats = [
            'total_employees' => $employees->count(),
            'present_today'   => AttendanceLog::whereIn('employee_id', $employees->pluck('id'))->where('date', $today)->where('status', 'Present')->count(),
            'late_today'      => AttendanceLog::whereIn('employee_id', $employees->pluck('id'))->where('date', $today)->where('is_late', true)->count(),
            'absent_today'    => $employees->count() - AttendanceLog::whereIn('employee_id', $employees->pluck('id'))->where('date', $today)->count(),
        ];

        return Inertia::render('HR/Attendance/Index', [
            'employees'   => $employees,
            'logs'        => $logs,
            'holidays'    => $holidays,
            'daysInMonth' => $daysInMonth,
            'month'       => $month,
            'year'        => $year,
            'stats'       => $stats,
        ]);
    }

    public function mark(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|exists:hr_employees,id',
            'date'         => 'required|date',
            'check_in'     => 'required|string',
            'check_out'    => 'nullable|string',
            'clock_in_ip'  => 'nullable|string',
            'clock_out_ip' => 'nullable|string',
            'is_late'      => 'boolean',
            'is_half_day'  => 'boolean',
            'location'     => 'nullable|string',
            'working_from' => 'required|string',
        ]);

        $date     = $validated['date'];
        $checkIn  = Carbon::parse("$date {$validated['check_in']}");
        $checkOut = $validated['check_out'] ? Carbon::parse("$date {$validated['check_out']}") : null;

        $status = 'Present';
        if ($validated['is_half_day'] ?? false) $status = 'Half Day';
        if ($validated['is_late'] ?? false)     $status = 'Late';

        AttendanceLog::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'date' => $date],
            [
                'check_in'     => $checkIn,
                'check_out'    => $checkOut,
                'clock_in_ip'  => $validated['clock_in_ip'] ?? null,
                'clock_out_ip' => $validated['clock_out_ip'] ?? null,
                'is_late'      => $validated['is_late'] ?? false,
                'is_half_day'  => $validated['is_half_day'] ?? false,
                'location'     => $validated['location'] ?? null,
                'working_from' => $validated['working_from'],
                'status'       => $status,
            ]
        );

        return back()->with('success', 'Attendance marked successfully.');
    }

    public function checkIn(Request $request)
    {
        $employee = auth()->user()->employee;
        if (!$employee) return back()->with('error', 'Employee record not found.');
        $today = Carbon::today()->toDateString();
        AttendanceLog::updateOrCreate(
            ['employee_id' => $employee->id, 'date' => $today],
            ['check_in' => Carbon::now(), 'clock_in_ip' => $request->ip(), 'status' => 'Present', 'working_from' => 'Office']
        );
        return back();
    }

    public function checkOut(Request $request)
    {
        $employee = auth()->user()->employee;
        if (!$employee) return back()->with('error', 'Employee record not found.');
        $today = Carbon::today()->toDateString();
        AttendanceLog::where('employee_id', $employee->id)->where('date', $today)->update([
            'check_out'    => Carbon::now(),
            'clock_out_ip' => $request->ip(),
        ]);
        return back();
    }
}
