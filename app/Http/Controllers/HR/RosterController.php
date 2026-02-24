<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RosterController extends Controller
{
    public function index(Request $request)
    {
        $clinic_id = auth()->user()->clinic_id;

        // Optionally default to current start of week (Monday)
        $startOfWeek = $request->input('start_date') 
            ? \Carbon\Carbon::parse($request->input('start_date')) 
            : \Carbon\Carbon::now()->startOfWeek();
            
        $endOfWeek = $startOfWeek->copy()->endOfWeek();

        $employees = \App\Models\HR\Employee::with('user:id,name')
            ->where('clinic_id', $clinic_id)
            ->where('status', 'Active')
            ->get();

        $shifts = \App\Models\HR\Shift::where('clinic_id', $clinic_id)->get();

        $rosters = \App\Models\HR\Roster::with('shift')
            ->where('clinic_id', $clinic_id)
            ->whereBetween('date', [$startOfWeek->format('Y-m-d'), $endOfWeek->format('Y-m-d')])
            ->get();

        $holidays = \App\Models\HR\Holiday::where('clinic_id', $clinic_id)
            ->whereBetween('date', [$startOfWeek->format('Y-m-d'), $endOfWeek->format('Y-m-d')])
            ->get();

        return \Inertia\Inertia::render('HR/Roster/Index', [
            'employees' => $employees,
            'shifts' => $shifts,
            'rosters' => $rosters,
            'holidays' => $holidays,
            'startDate' => $startOfWeek->format('Y-m-d'),
            'endDate' => $endOfWeek->format('Y-m-d')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required', // Can be an ID or 'all'
            'shift_id' => 'nullable|exists:hr_shifts,id', // null means clear shift (off)
            'dates' => 'required|array',
            'dates.*' => 'required|date'
        ]);

        $clinic_id = auth()->user()->clinic_id;

        $employeeIds = [];
        if ($validated['employee_id'] === 'all') {
            $employeeIds = \App\Models\HR\Employee::where('clinic_id', $clinic_id)->pluck('id')->toArray();
        } else {
            $employeeIds = [$validated['employee_id']];
        }

        foreach ($employeeIds as $empId) {
            foreach ($validated['dates'] as $date) {
                if ($validated['shift_id']) {
                    // Assign or update shift
                    \App\Models\HR\Roster::updateOrCreate(
                        ['clinic_id' => $clinic_id, 'employee_id' => $empId, 'date' => $date],
                        ['shift_id' => $validated['shift_id']]
                    );
                } else {
                    // Clear shift (delete)
                    \App\Models\HR\Roster::where('clinic_id', $clinic_id)
                        ->where('employee_id', $empId)
                        ->where('date', $date)
                        ->delete();
                }
            }
        }

        return back()->with('success', 'Roster updated successfully.');
    }
}
