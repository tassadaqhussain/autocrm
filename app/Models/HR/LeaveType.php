<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $table = 'hr_leave_types';
    protected $fillable = ['clinic_id', 'name', 'days_per_year'];
}
