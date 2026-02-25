<?php

declare(strict_types=1);

namespace App\Modules\Deals\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lead_id' => 'required|exists:leads,id',
            'name' => 'required|string|max:255',
            'pipeline' => 'required|string',
            'stage' => 'required|string|in:Generated,Qualified,Initial Contact,Schedule Appointment,Proposal Sent,Win,Lost',
            'value' => 'required|numeric',
            'close_date' => 'required|date',
            'category' => 'nullable|string',
            'agent_id' => 'nullable|exists:users,id',
            'watcher_id' => 'nullable|exists:users,id',
            'product_ids' => 'nullable|array',
        ];
    }
}
