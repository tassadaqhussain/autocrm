<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Modules\Leads\Models\Lead;
use App\Models\Campaign;
use App\Models\Appointment;

class Clinic extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'logo', 'settings', 'is_active', 'service_type_id', 'subscription_plan_id', 'status'];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
