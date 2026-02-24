<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Departments
        Schema::create('hr_departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Designations
        Schema::create('hr_designations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('hr_departments')->onDelete('cascade');
            $table->string('title');
            $table->timestamps();
        });

        // 3. Employee Shifts
        Schema::create('hr_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Morning, Evening, Night
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        // 4. Employee Profiles (Extends Users)
        Schema::create('hr_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('hr_departments')->onDelete('set null');
            $table->foreignId('designation_id')->nullable()->constrained('hr_designations')->onDelete('set null');
            $table->foreignId('shift_id')->nullable()->constrained('hr_shifts')->onDelete('set null');
            
            $table->string('employee_id')->nullable(); // Unique company ID
            $table->string('employment_type')->default('Full-time'); // Full-time, Part-time, Contract
            $table->string('status')->default('Active'); // Active, On Leave, Terminated
            $table->date('joining_date')->nullable();
            $table->date('termination_date')->nullable();
            
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            
            $table->timestamps();
        });

        // 5. Attendance Logs
        Schema::create('hr_attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('hr_employees')->onDelete('cascade');
            $table->date('date');
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            $table->string('status')->default('Present'); // Present, Late, Half-day, Absent
            $table->integer('overtime_minutes')->default(0);
            $table->timestamps();
        });

        // 6. Leave Types
        Schema::create('hr_leave_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Sick, Casual, Annual
            $table->integer('days_per_year');
            $table->timestamps();
        });

        // 7. Leave Requests
        Schema::create('hr_leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('hr_employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('hr_leave_types')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 8. Payroll / Salary Structures
        Schema::create('hr_salary_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->unique()->constrained('hr_employees')->onDelete('cascade');
            $table->decimal('base_salary', 12, 2);
            $table->json('allowances')->nullable(); // {housing: 500, transport: 200}
            $table->json('deductions')->nullable();
            $table->decimal('commission_rate', 5, 2)->default(0); // For Counselors
            $table->timestamps();
        });

        // 9. Monthly Payroll Records
        Schema::create('hr_payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('hr_employees')->onDelete('cascade');
            $table->string('month'); // "2024-03"
            $table->decimal('gross_salary', 12, 2);
            $table->decimal('net_salary', 12, 2);
            $table->json('breakdown')->nullable();
            $table->string('payment_status')->default('Unpaid'); // Unpaid, Paid
            $table->dateTime('processed_at')->nullable();
            $table->timestamps();
        });

        // 10. Documents
        Schema::create('hr_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('hr_employees')->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // Contract, ID, Certificate
            $table->string('file_path');
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });

        // 11. Holidays
        Schema::create('hr_holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->date('date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hr_holidays');
        Schema::dropIfExists('hr_documents');
        Schema::dropIfExists('hr_payrolls');
        Schema::dropIfExists('hr_salary_structures');
        Schema::dropIfExists('hr_leaves');
        Schema::dropIfExists('hr_leave_types');
        Schema::dropIfExists('hr_attendance_logs');
        Schema::dropIfExists('hr_employees');
        Schema::dropIfExists('hr_shifts');
        Schema::dropIfExists('hr_designations');
        Schema::dropIfExists('hr_departments');
    }
};
