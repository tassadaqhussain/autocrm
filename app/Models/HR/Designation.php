<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    protected $table = 'hr_designations';

    protected $fillable = [
        'department_id',
        'title'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'designation_id');
    }
}
