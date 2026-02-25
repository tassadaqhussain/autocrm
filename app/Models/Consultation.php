<?php

namespace App\Models;

use App\Modules\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = ['lead_id', 'doctor_name', 'is_surgical_candidate', 'notes'];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
