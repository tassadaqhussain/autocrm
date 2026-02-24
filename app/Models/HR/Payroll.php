<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $table = 'hr_payrolls';
    protected $fillable = ['employee_id', 'month', 'gross_salary', 'net_salary', 'breakdown', 'payment_status', 'processed_at'];
    protected $casts = [
        'breakdown' => 'json'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
