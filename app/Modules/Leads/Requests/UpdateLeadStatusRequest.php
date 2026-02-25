<?php

declare(strict_types=1);

namespace App\Modules\Leads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:New,Contacted,Appointment Scheduled,Consultation Done',
        ];
    }
}
