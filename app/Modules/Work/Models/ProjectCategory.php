<?php

namespace App\Modules\Work\Models;

use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectCategory extends Model
{
    use BelongsToClinic;

    protected $fillable = ['clinic_id', 'name'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'category_id');
    }
}
