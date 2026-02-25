<?php

declare(strict_types=1);

namespace App\Modules\Deals\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddFollowUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'next_follow_up_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'send_reminder' => 'nullable|boolean',
            'remark' => 'nullable|string',
            'status' => 'required|string|in:Pending,Completed,Cancelled',
        ];
    }
}
