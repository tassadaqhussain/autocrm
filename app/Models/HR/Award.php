<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    protected $table = 'hr_awards';
    protected $fillable = ['clinic_id', 'title', 'icon', 'color', 'summary'];

    public function clinic()
    {
        return $this->belongsTo(\App\Models\Clinic::class);
    }
}
