<?php

declare(strict_types=1);

namespace App\Modules\Leads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'required|string',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'counselor_id' => 'nullable|exists:users,id',
            'bmi' => 'nullable|numeric',
            'health_info' => 'nullable|string',
            'urgency' => 'nullable|string',
        ];
    }
}
