<?php

declare(strict_types=1);

namespace App\Modules\Deals\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadProposalFilesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxKb = 10240; // 10MB
        return [
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:' . $maxKb],
            'file' => ['nullable', 'file', 'max:' . $maxKb],
        ];
    }
}
