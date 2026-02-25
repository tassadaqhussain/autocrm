<?php

namespace App\Models;

use App\Modules\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'lead_id',
        'type',
        'status',
        'message',
        'escalation_level'
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
