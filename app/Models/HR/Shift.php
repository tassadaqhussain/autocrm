<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $table = 'hr_shifts';
    protected $fillable = ['clinic_id', 'name', 'start_time', 'end_time'];

    public function employees()
    {
        return $this->hasMany(Employee::class, 'shift_id');
    }
}
