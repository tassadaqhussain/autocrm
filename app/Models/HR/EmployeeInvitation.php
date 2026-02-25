<?php

namespace App\Models\HR;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Model;

class EmployeeInvitation extends Model
{
    protected $table = 'employee_invitations';

    protected $fillable = [
        'clinic_id',
        'token',
        'domain',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function isValid(): bool
    {
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        return true;
    }
}
