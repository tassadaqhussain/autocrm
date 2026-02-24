<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\User;
use App\Models\HR\Department;
use App\Models\HR\Designation;
use App\Models\HR\Shift;
use App\Models\HR\Employee;
use App\Models\HR\LeaveType;
use App\Models\HR\Leave;
use Illuminate\Support\Facades\Hash;

class HRModuleSeeder extends Seeder
{
    public function run(): void
    {
        $clinic = Clinic::first() ?? Clinic::create(['name' => 'Elite Medical Clinic', 'slug' => 'elite-medical']);
        $clinicId = $clinic->id;

        // 1. Departments
        $cardiology = Department::create(['clinic_id' => $clinicId, 'name' => 'Cardiology', 'description' => 'Heart and vascular care']);
        $pediatrics = Department::create(['clinic_id' => $clinicId, 'name' => 'Pediatrics', 'description' => 'Child health and development']);
        $administration = Department::create(['clinic_id' => $clinicId, 'name' => 'Administration', 'description' => 'Clinic operations and management']);

        // 2. Designations
        $headCardio = Designation::create(['department_id' => $cardiology->id, 'title' => 'Head of Cardiology']);
        $seniorCardio = Designation::create(['department_id' => $cardiology->id, 'title' => 'Senior Surgeon']);
        
        $headPeds = Designation::create(['department_id' => $pediatrics->id, 'title' => 'Lead Pediatrician']);
        $nursePeds = Designation::create(['department_id' => $pediatrics->id, 'title' => 'Registered Nurse']);
        
        $opsManager = Designation::create(['department_id' => $administration->id, 'title' => 'Operations Manager']);

        // 3. Shifts
        $morningShift = Shift::create(['clinic_id' => $clinicId, 'name' => 'Morning Shift', 'start_time' => '08:00', 'end_time' => '16:00']);
        $eveningShift = Shift::create(['clinic_id' => $clinicId, 'name' => 'Evening Shift', 'start_time' => '16:00', 'end_time' => '00:00']);
        $nightShift = Shift::create(['clinic_id' => $clinicId, 'name' => 'Night Shift', 'start_time' => '00:00', 'end_time' => '08:00']);

        // 4. Employees & Users
        $usersData = [
            ['name' => 'Dr. Eleanor Vance', 'email' => 'eleanor@crm.com', 'role' => 'Doctor', 'dept' => $cardiology->id, 'desig' => $headCardio->id, 'shift' => $morningShift->id],
            ['name' => 'Dr. Mark Sloan', 'email' => 'mark@crm.com', 'role' => 'Doctor', 'dept' => $cardiology->id, 'desig' => $seniorCardio->id, 'shift' => $eveningShift->id],
            ['name' => 'Dr. Addison Montgomery', 'email' => 'addison@crm.com', 'role' => 'Doctor', 'dept' => $pediatrics->id, 'desig' => $headPeds->id, 'shift' => $morningShift->id],
            ['name' => 'Nurse Olivia', 'email' => 'olivia@crm.com', 'role' => 'Staff', 'dept' => $pediatrics->id, 'desig' => $nursePeds->id, 'shift' => $nightShift->id],
            ['name' => 'Richard Webber', 'email' => 'richard@crm.com', 'role' => 'Admin', 'dept' => $administration->id, 'desig' => $opsManager->id, 'shift' => $morningShift->id],
        ];

        $employees = [];

        foreach ($usersData as $idx => $ud) {
            $user = User::create([
                'name' => $ud['name'],
                'email' => $ud['email'],
                'password' => Hash::make('password'),
                'role' => $ud['role'],
                'clinic_id' => $clinicId,
            ]);

            $emp = Employee::create([
                'user_id' => $user->id,
                'clinic_id' => $clinicId,
                'department_id' => $ud['dept'],
                'designation_id' => $ud['desig'],
                'shift_id' => $ud['shift'],
                'employee_id' => 'EMP-' . str_pad($idx + 100, 4, '0', STR_PAD_LEFT),
                'employment_type' => 'Full-time',
                'status' => 'Active',
                'joining_date' => now()->subMonths(random_int(1, 36)),
            ]);

            $employees[] = $emp;
        }

        // 5. Leave Types
        $sickLeave = LeaveType::create(['clinic_id' => $clinicId, 'name' => 'Sick Leave', 'days_per_year' => 14]);
        $casualLeave = LeaveType::create(['clinic_id' => $clinicId, 'name' => 'Casual Leave', 'days_per_year' => 10]);
        $annualLeave = LeaveType::create(['clinic_id' => $clinicId, 'name' => 'Annual Leave', 'days_per_year' => 20]);

        // 6. Leaves
        // Approved leave
        Leave::create([
            'employee_id' => $employees[0]->id,
            'leave_type_id' => $annualLeave->id,
            'start_date' => now()->addDays(5)->format('Y-m-d'),
            'end_date' => now()->addDays(10)->format('Y-m-d'),
            'duration_type' => 'Multiple',
            'reason' => 'Family vacation to Hawaii',
            'status' => 'Approved',
            'approved_by' => User::first()->id ?? null
        ]);

        // Pending leave
        Leave::create([
            'employee_id' => $employees[1]->id,
            'leave_type_id' => $sickLeave->id,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->format('Y-m-d'),
            'duration_type' => 'Full Day',
            'reason' => 'Feeling under the weather',
            'status' => 'Pending'
        ]);

        // Pending Half Day
        Leave::create([
            'employee_id' => $employees[3]->id,
            'leave_type_id' => $casualLeave->id,
            'start_date' => now()->addDays(2)->format('Y-m-d'),
            'end_date' => now()->addDays(2)->format('Y-m-d'),
            'duration_type' => 'First Half',
            'reason' => 'Doctor appointment in the morning',
            'status' => 'Pending'
        ]);
        
        // Rejected leave
        Leave::create([
            'employee_id' => $employees[2]->id,
            'leave_type_id' => $casualLeave->id,
            'start_date' => now()->subDays(5)->format('Y-m-d'),
            'end_date' => now()->subDays(3)->format('Y-m-d'),
            'duration_type' => 'Multiple',
            'reason' => 'Attending a medical conference',
            'status' => 'Rejected',
            'approved_by' => User::first()->id ?? null
        ]);
    }
}
