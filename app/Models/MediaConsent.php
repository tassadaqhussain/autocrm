<?php

namespace App\Models;

use App\Modules\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaConsent extends Model
{
    use HasFactory, \App\Traits\BelongsToClinic;

    protected $table = 'media_consent';

    protected $fillable = [
        'clinic_id',
        'lead_id',
        'has_consented',
        'is_success_story',
        'media_manager_notified',
        'signature_path'
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
