<?php

declare(strict_types=1);

namespace App\Modules\Clients\Models;

use App\Models\Clinic;
use App\Traits\BelongsToClinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory, BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'salutation',
        'name',
        'email',
        'mobile',
        'country',
        'gender',
        'language',
        'client_category',
        'client_sub_category',
        'login_allowed',
        'email_notifications',
        'company_name',
        'official_website',
        'tax_name',
        'gst_vat_number',
        'office_phone',
        'city',
        'state',
        'postal_code',
        'added_by_user_id',
        'company_address',
        'shipping_address',
        'note',
        'status',
    ];

    protected $casts = [
        'login_allowed' => 'boolean',
        'email_notifications' => 'boolean',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
