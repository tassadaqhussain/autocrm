<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    protected $table = 'hr_attendance_logs';
    protected $fillable = ['employee_id', 'date', 'check_in', 'check_out', 'status', 'overtime_minutes'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
