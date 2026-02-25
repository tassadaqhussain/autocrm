<?php

namespace App\Models;

use App\Modules\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'name',
        'type',
        'budget',
        'budget_type',
        'cost_per_lead',
        'clinic_id',
        'assigned_manager_id',
        'objective',
        'status',
        'channel',
        'description',
        'ad_copy',
        'ad_creative_url',
        'target_audience',
        'starts_at',
        'ends_at'
    ];

    protected $casts = [
        'target_audience' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_manager_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Marketing\MarketingExpense::class);
    }

    public function creatives(): HasMany
    {
        return $this->hasMany(Marketing\MarketingCreative::class);
    }
}
