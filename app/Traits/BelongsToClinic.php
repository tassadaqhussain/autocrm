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
            // Only set clinic_id if it's not set and user has a clinic_id
            if (empty($model->clinic_id) && Auth::check() && Auth::user()->clinic_id) {
                $model->clinic_id = Auth::user()->clinic_id;
            }
        });

        // Only apply global scope if we have a clinic context
        if (Auth::check() && Auth::user()->clinic_id) {
            static::addGlobalScope('clinic', function (Builder $builder) {
                $builder->where(function ($query) {
                    $query->where('clinic_id', Auth::user()->clinic_id)
                        ->orWhereNull('clinic_id');
                });
            });
        }
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
