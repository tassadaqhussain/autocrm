<?php

namespace App\Modules\Work\Models;

use App\Models\Clinic;
use App\Modules\Clients\Models\Client;
use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'client_id',
        'project_name',
        'short_code',
        'category_id',
        'department_id',
        'description',
        'summary',
        'notes',
        'start_date',
        'deadline',
        'no_deadline',
        'status',
        'budget',
        'currency',
        'hours_estimate',
        'public_gantt_chart',
        'public_task_board',
        'task_approval',
        'is_public',
        'allow_manual_time_logs',
        'enable_miroboard',
        'send_task_notification',
    ];

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Clinic::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'category_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(\App\Models\HR\Department::class, 'department_id');
    }

    public function members(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\User::class, 'project_members');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
