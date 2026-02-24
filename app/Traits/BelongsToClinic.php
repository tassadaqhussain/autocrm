<?php

namespace App\Traits;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToClinic
{
    protected static function bootBelongsToClinic()
    {
        static::creating(function ($model) {
            if (empty($model->clinic_id) && Auth::check() && Auth::user()->clinic_id) {
                $model->clinic_id = Auth::user()->clinic_id;
            }
        });

        if (Auth::check() && Auth::user()->clinic_id) {
            static::addGlobalScope('clinic', function (Builder $builder) {
                $builder->where('clinic_id', Auth::user()->clinic_id);
            });
        }
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
