<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'name', 
        'phone', 
        'source', 
        'campaign_id', 
        'counselor_id', 
        'clinic_id',
        'status', 
        'bmi', 
        'health_info', 
        'urgency', 
        'score'
    ];

    protected $casts = [
        'phone' => 'encrypted',
        'health_info' => 'encrypted',
        'score' => 'integer',
        'bmi' => 'decimal:2'
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function counselor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    public function consultation(): HasOne
    {
        return $this->hasOne(Consultation::class);
    }

    public function mediaConsent(): HasOne
    {
        return $this->hasOne(MediaConsent::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function influencer(): BelongsTo
    {
        return $this->belongsTo(Marketing\MarketingInfluencer::class, 'influencer_id');
    }
}
