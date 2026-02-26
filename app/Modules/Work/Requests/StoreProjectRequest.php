<?php

declare(strict_types=1);

namespace App\Modules\Work\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'project_name' => 'required|string|max:255',
            'client_id' => 'nullable|exists:clients,id',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|string|in:Not Started,In Progress,On Hold,Canceled,Finished',
            'budget' => 'nullable|numeric|min:0',
        ];
    }
}
