<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Clinic;
use App\Models\HR\Department;
use App\Models\HR\Designation;
use App\Models\HR\Shift;
use App\Models\User;
use App\Models\HR\Employee;

class HRSeeder extends Seeder
{
    public function run()
    {
        $clinic = Clinic::first();
        if (!$clinic) return;

        // 1. Departments
        $medical = Department::create(['clinic_id' => $clinic->id, 'name' => 'Medical & Surgery', 'description' => 'Doctors and clinical specialists.']);
        $ops = Department::create(['clinic_id' => $clinic->id, 'name' => 'Operations & Counseling', 'description' => 'Patient coordinators and counselors.']);
        $admin = Department::create(['clinic_id' => $clinic->id, 'name' => 'Administration', 'description' => 'HR, Finance and Management.']);

        // 2. Designations
        Designation::create(['department_id' => $medical->id, 'title' => 'Senior Surgeon']);
        Designation::create(['department_id' => $medical->id, 'title' => 'Clinical Doctor']);
        Designation::create(['department_id' => $ops->id, 'title' => 'Senior Counselor']);
        Designation::create(['department_id' => $admin->id, 'title' => 'HR Manager']);

        // 3. Shifts
        Shift::create(['clinic_id' => $clinic->id, 'name' => 'Morning', 'start_time' => '08:00', 'end_time' => '16:00']);
        Shift::create(['clinic_id' => $clinic->id, 'name' => 'Evening', 'start_time' => '16:00', 'end_time' => '23:59']);

        // 4. Onboard existing users as employees
        User::where('clinic_id', $clinic->id)->get()->each(function ($user) use ($clinic, $medical, $ops, $admin) {
            $dept = null;
            if ($user->role === 'Doctor') $dept = $medical;
            elseif ($user->role === 'Counselor') $dept = $ops;
            else $dept = $admin;

            Employee::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'clinic_id' => $clinic->id,
                    'department_id' => $dept?->id,
                    'employee_id' => 'EMP-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'employment_type' => 'Full-time',
                    'status' => 'Active',
                    'joining_date' => now()->subMonths(6),
                ]
            );
        });
    }
}
