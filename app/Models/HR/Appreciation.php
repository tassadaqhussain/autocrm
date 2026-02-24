<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Appreciation extends Model
{
    protected $table = 'hr_appreciations';
    protected $fillable = ['clinic_id', 'employee_id', 'title', 'description', 'given_date', 'given_by'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function givenBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'given_by');
    }
}
