<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\Employee;
use App\Models\HR\EmployeeInvitation;
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

    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'message' => 'nullable|string|max:1000',
        ]);

        $clinicId = auth()->user()->clinic_id;
        $tempPassword = \Illuminate\Support\Str::random(12);

        DB::transaction(function () use ($request, $clinicId, $tempPassword) {
            $user = User::create([
                'name' => explode('@', $request->email)[0],
                'email' => $request->email,
                'password' => Hash::make($tempPassword),
                'role' => 'Employee',
                'clinic_id' => $clinicId,
            ]);

            Employee::create([
                'user_id' => $user->id,
                'clinic_id' => $clinicId,
                'department_id' => null,
                'designation_id' => null,
                'shift_id' => null,
                'employee_id' => 'EMP-' . strtoupper(substr(uniqid(), -5)),
                'employment_type' => 'Full-time',
                'joining_date' => now(),
                'status' => 'Invited',
            ]);

            // TODO: Queue invite email with login link and temp password
        });

        return redirect()->route('hr.employees.index')->with('success', 'Invitation sent.');
    }

    public function createInviteLink(Request $request)
    {
        $request->validate([
            'domain' => 'nullable|string|max:255',
        ]);

        $clinicId = auth()->user()->clinic_id;
        $token = bin2hex(random_bytes(20));

        EmployeeInvitation::create([
            'clinic_id' => $clinicId,
            'token' => $token,
            'domain' => $request->filled('domain') ? $request->domain : null,
            'expires_at' => now()->addDays(7),
        ]);

        $url = url('/invitation/' . $token);

        return response()->json(['url' => $url]);
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

    public function update(Request $request, Employee $employee)
    {
        $user = $employee->user;
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string',
            'department_id' => 'required|exists:hr_departments,id',
            'designation_id' => 'required|exists:hr_designations,id',
        ];
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:8';
        }
        $request->validate($rules);

        DB::transaction(function () use ($request, $employee, $user) {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
            ];
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }
            if ($request->has('phone')) {
                $userData['phone'] = $request->phone;
            }
            $user->update($userData);

            $employee->update([
                'department_id' => $request->department_id,
                'designation_id' => $request->designation_id,
                'shift_id' => $request->shift_id ?: null,
                'employment_type' => $request->employment_type ?? 'Full-time',
                'joining_date' => $request->filled('joining_date') ? $request->joining_date : $employee->joining_date,
            ]);
        });

        return redirect()->route('hr.employees.index');
    }

    public function destroy(Employee $employee)
    {
        $user = $employee->user;
        $employee->delete();
        $user->delete();
        return redirect()->route('hr.employees.index');
    }
}
