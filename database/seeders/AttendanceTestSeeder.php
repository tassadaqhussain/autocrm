<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\HR\Employee;
use App\Models\HR\Department;
use App\Models\HR\Designation;
use App\Models\HR\Shift;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AttendanceTestSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have a clinic_id (using 1 as default)
        $clinicId = 1;

        // 1. Setup Base Data
        $dept = Department::firstOrCreate(
            ['name' => 'General Medicine', 'clinic_id' => $clinicId]
        );

        $desig = Designation::firstOrCreate(
            ['title' => 'Clinical Specialist', 'department_id' => $dept->id]
        );

        $shift = Shift::firstOrCreate(
            ['name' => 'Morning Shift', 'clinic_id' => $clinicId],
            ['start_time' => '09:00:00', 'end_time' => '17:00:00']
        );

        // 2. Clear previous test user if exists
        User::where('email', 'test@example.com')->delete();

        // 3. Create Test User
        $user = User::create([
            'name' => 'Test Employee',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'Doctor',
            'clinic_id' => $clinicId,
        ]);

        // 4. Link as Employee
        Employee::create([
            'user_id' => $user->id,
            'clinic_id' => $clinicId,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'shift_id' => $shift->id,
            'employee_id' => 'EMP-TEST-001',
            'employment_type' => 'Full-time',
            'joining_date' => Carbon::now()->subMonths(6),
            'status' => 'Active',
        ]);
    }
}
