<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Roster extends Model
{
    protected $table = 'hr_rosters';
    protected $fillable = ['clinic_id', 'employee_id', 'shift_id', 'date'];

    public function employee()
    {
        return $this->belongsTo(\App\Models\HR\Employee::class, 'employee_id');
    }

    public function shift()
    {
        return $this->belongsTo(\App\Models\HR\Shift::class, 'shift_id');
    }
}
