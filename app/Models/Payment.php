<?php

namespace App\Models;

use App\Modules\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'lead_id',
        'amount',
        'currency',
        'method',
        'status',
        'transaction_reference',
        'payment_details',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'transaction_reference' => 'encrypted',
        'payment_details' => 'encrypted:json',
        'amount' => 'decimal:2',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
