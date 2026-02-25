<?php

declare(strict_types=1);

namespace App\Modules\Deals\Models;

use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;

class DealNote extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'deal_id',
        'clinic_id',
        'detail',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}
