<?php

declare(strict_types=1);

namespace App\Modules\Deals\Models;

use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;

class DealProposal extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'deal_id',
        'clinic_id',
        'proposal_number',
        'total_amount',
        'proposal_date',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'proposal_date' => 'date',
        'valid_until' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function files()
    {
        return $this->hasMany(DealProposalFile::class, 'deal_proposal_id');
    }
}
