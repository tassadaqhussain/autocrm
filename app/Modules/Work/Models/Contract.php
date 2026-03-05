<?php

namespace App\Modules\Work\Models;

use App\Models\Clinic;
use App\Modules\Clients\Models\Client;
use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
    use HasFactory, BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'contract_number',
        'client_id',
        'project_id',
        'contract_type_id',
        'subject',
        'description',
        'amount',
        'currency',
        'start_date',
        'end_date',
        'cell',
        'office_phone',
        'city',
        'state',
        'country',
        'postal_code',
        'alternate_address',
        'notes',
        'status',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
