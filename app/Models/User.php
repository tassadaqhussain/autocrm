<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'clinic_id',
        'role',
        'phone',
        'salary',
        'joined_at',
        'status',
        'bio',
        'specialization',
        'permissions',
    ];

    /**
     * RBAC Helpers
     */
    public function role_relation()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function hasPermission($permission)
    {
        // 1. Check for specific overrides in DB (User level)
        $overrides = $this->permissions ?? [];
        if (in_array('*', $overrides)) return true;
        if (in_array($permission, $overrides)) return true;

        // 2. Check Role permissions (Dynamic DB check)
        if ($this->role_id) {
            $rolePermissions = $this->role_relation->permissions->pluck('slug')->toArray();
            if (in_array('*', $rolePermissions)) return true;
            if (in_array($permission, $rolePermissions)) return true;
        }

        // 3. Admin check (Legacy/Safety)
        if ($this->role === 'Admin') return true;

        return false;
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function leads()
    {
        return $this->hasMany(\App\Modules\Leads\Models\Lead::class, 'counselor_id');
    }

    public function employee()
    {
        return $this->hasOne(\App\Models\HR\Employee::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'phone' => 'encrypted',
            'salary' => 'encrypted',
            'permissions' => 'array',
        ];
    }
}
