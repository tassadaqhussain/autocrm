<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\AttendanceLog;
use App\Models\HR\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $employee = $user->employee;
        $clinicId = $user->clinic_id;

        if (!$employee) {
            // Handle cases where user is not an employee (e.g. Super Admin)
            return Inertia::render('HR/Attendance/Index', [
                'logs' => [],
                'todayLog' => null,
                'stats' => ['present' => 0, 'late' => 0, 'absent' => 0]
            ]);
        }

        $today = Carbon::today()->toDateString();
        $todayLog = AttendanceLog::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        // Get recent logs for this employee
        $logs = AttendanceLog::where('employee_id', $employee->id)
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        // Admin stats if applicable
        $stats = [
            'total_employees' => Employee::where('clinic_id', $clinicId)->count(),
            'present_today' => AttendanceLog::whereHas('employee', function($q) use ($clinicId) {
                $q->where('clinic_id', $clinicId);
            })->where('date', $today)->count(),
        ];

        return Inertia::render('HR/Attendance/Index', [
            'employee' => $employee->load('shift'),
            'todayLog' => $todayLog,
            'recentLogs' => $logs,
            'stats' => $stats
        ]);
    }

    public function checkIn(Request $request)
    {
        $employee = auth()->user()->employee;
        if (!$employee) return back()->with('error', 'Employee record not found.');

        $today = Carbon::today()->toDateString();
        
        $log = AttendanceLog::updateOrCreate(
            ['employee_id' => $employee->id, 'date' => $today],
            [
                'check_in' => Carbon::now(),
                'status' => 'Present'
            ]
        );

        return back();
    }

    public function checkOut(Request $request)
    {
        $employee = auth()->user()->employee;
        if (!$employee) return back()->with('error', 'Employee record not found.');

        $today = Carbon::today()->toDateString();
        
        $log = AttendanceLog::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($log) {
            $log->update([
                'check_out' => Carbon::now()
            ]);
        }

        return back();
    }
}
