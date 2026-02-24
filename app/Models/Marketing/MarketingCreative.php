<?php

namespace App\Models\Marketing;

use App\Models\Campaign;
use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingCreative extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'campaign_id',
        'name',
        'type',
        'url',
        'thumbnail_url',
        'status'
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
