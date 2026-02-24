<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $table = 'hr_holidays';
    protected $fillable = ['clinic_id', 'name', 'date'];
}
