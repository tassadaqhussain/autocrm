<?php

declare(strict_types=1);

namespace App\Modules\Deals\Models;

use App\Models\User;
use App\Modules\Leads\Models\Lead;
use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory, BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'lead_id',
        'name',
        'pipeline',
        'stage',
        'value',
        'close_date',
        'category',
        'agent_id',
        'watcher_id',
        'product_ids',
    ];

    protected $casts = [
        'product_ids' => 'array',
        'close_date' => 'date',
        'value' => 'decimal:2',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function watcher()
    {
        return $this->belongsTo(User::class, 'watcher_id');
    }

    public function followUps()
    {
        return $this->hasMany(DealFollowUp::class);
    }

    public function proposals()
    {
        return $this->hasMany(DealProposal::class);
    }

    public function notes()
    {
        return $this->hasMany(DealNote::class);
    }

    public function files()
    {
        return $this->hasMany(DealFile::class);
    }
}
