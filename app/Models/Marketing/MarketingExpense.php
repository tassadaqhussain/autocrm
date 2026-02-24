<?php

namespace App\Models\Marketing;

use App\Models\Campaign;
use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingExpense extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'campaign_id',
        'title',
        'amount',
        'expense_date',
        'category',
        'notes'
    ];

    protected $casts = [
        'expense_date' => 'date',
        'amount' => 'decimal:2'
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
