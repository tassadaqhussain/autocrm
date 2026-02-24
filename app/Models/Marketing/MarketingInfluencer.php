<?php

namespace App\Models\Marketing;

use App\Models\Clinic;
use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketingInfluencer extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'name',
        'handle',
        'platform',
        'email',
        'phone',
        'notes',
        'status'
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'influencer_id');
    }
}
