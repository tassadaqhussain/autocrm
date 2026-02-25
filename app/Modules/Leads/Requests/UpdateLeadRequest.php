<?php

declare(strict_types=1);

namespace App\Modules\Leads\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string',
            'counselor_id' => 'nullable|exists:users,id',
            'bmi' => 'nullable|numeric',
            'health_info' => 'nullable|string',
            'urgency' => 'nullable|string',
        ];
    }
}
