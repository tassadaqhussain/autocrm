<?php

declare(strict_types=1);

namespace App\Modules\Deals\Models;

use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;

class DealProposalFile extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'deal_proposal_id',
        'clinic_id',
        'name',
        'path',
        'size',
        'type',
    ];

    public function proposal()
    {
        return $this->belongsTo(DealProposal::class, 'deal_proposal_id');
    }
}
