<?php

declare(strict_types=1);

namespace App\Modules\Deals\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'proposal_number' => 'required|string',
            'total_amount' => 'required|numeric',
            'proposal_date' => 'required|date',
            'valid_until' => 'required|date',
            'status' => 'required|string',
        ];
    }
}
