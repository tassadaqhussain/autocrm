<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class SalaryStructure extends Model
{
    protected $table = 'hr_salary_structures';
    protected $fillable = ['employee_id', 'base_salary', 'allowances', 'deductions', 'commission_rate'];
    protected $casts = [
        'allowances' => 'json',
        'deductions' => 'json'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
