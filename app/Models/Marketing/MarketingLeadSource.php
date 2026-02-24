<?php

namespace App\Models\Marketing;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingLeadSource extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'name',
        'channel',
        'tracking_number',
        'attribution_rules',
        'is_active'
    ];

    protected $casts = [
        'attribution_rules' => 'array',
        'is_active' => 'boolean'
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
}
