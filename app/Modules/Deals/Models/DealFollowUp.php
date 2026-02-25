<?php

declare(strict_types=1);

namespace App\Modules\Deals\Models;

use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;

class DealFollowUp extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'deal_id',
        'clinic_id',
        'next_follow_up_date',
        'start_time',
        'send_reminder',
        'remark',
        'status',
    ];

    protected $casts = [
        'next_follow_up_date' => 'date',
        'send_reminder' => 'boolean',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}
