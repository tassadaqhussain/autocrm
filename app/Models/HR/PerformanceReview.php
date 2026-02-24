<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    protected $table = 'hr_performance_reviews';

    protected $fillable = [
        'clinic_id', 'employee_id', 'reviewer_id',
        'period', 'review_date', 'rating', 'category',
        'strengths', 'improvements', 'goals', 'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(\App\Models\User::class, 'reviewer_id');
    }
}
