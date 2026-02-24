<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Clinic;

class Employee extends Model
{
    protected $table = 'hr_employees';

    protected $fillable = [
        'user_id',
        'clinic_id',
        'department_id',
        'designation_id',
        'shift_id',
        'employee_id',
        'employment_type',
        'status',
        'joining_date',
        'termination_date',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class, 'designation_id');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }

    public function attendanceLogs()
    {
        return $this->hasMany(AttendanceLog::class, 'employee_id');
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class, 'employee_id');
    }

    public function salaryStructure()
    {
        return $this->hasOne(SalaryStructure::class, 'employee_id');
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'employee_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'employee_id');
    }
}
