<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\Employee;
use App\Models\HR\Department;
use App\Models\HR\Designation;
use App\Models\HR\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index()
    {
        $clinicId = auth()->user()->clinic_id;

        $employees = Employee::with(['user', 'department', 'designation', 'shift'])
            ->where('clinic_id', $clinicId)
            ->get();

        $departments = Department::where('clinic_id', $clinicId)->get();
        $designations = Designation::whereIn('department_id', $departments->pluck('id'))->get();
        $shifts = Shift::where('clinic_id', $clinicId)->get();

        return Inertia::render('HR/Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'designations' => $designations,
            'shifts' => $shifts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'department_id' => 'required|exists:hr_departments,id',
            'designation_id' => 'required|exists:hr_designations,id',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'clinic_id' => auth()->user()->clinic_id,
            ]);

            Employee::create([
                'user_id' => $user->id,
                'clinic_id' => auth()->user()->clinic_id,
                'department_id' => $request->department_id,
                'designation_id' => $request->designation_id,
                'shift_id' => $request->shift_id,
                'employee_id' => 'EMP-' . strtoupper(substr(uniqid(), -5)),
                'employment_type' => $request->employment_type ?? 'Full-time',
                'joining_date' => $request->joining_date ?? now(),
                'status' => 'Active',
            ]);
        });

        return redirect()->route('hr.employees.index');
    }
}
