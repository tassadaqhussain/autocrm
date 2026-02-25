<?php

declare(strict_types=1);

namespace App\Modules\Deals\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDealStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => 'required|string|in:Generated,Qualified,Initial Contact,Schedule Appointment,Proposal Sent,Win,Lost',
        ];
    }
}
