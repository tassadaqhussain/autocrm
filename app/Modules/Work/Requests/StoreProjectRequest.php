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
            'short_code' => 'nullable|string|max:50',
            'client_id' => 'nullable|exists:clients,id',
            'category_id' => 'nullable|exists:project_categories,id',
            'department_id' => 'nullable|exists:hr_departments,id',
            'description' => 'nullable|string',
            'summary' => 'nullable|string',
            'notes' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'no_deadline' => 'nullable|boolean',
            'status' => 'required|string|in:Not Started,In Progress,On Hold,Canceled,Finished',
            'budget' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'hours_estimate' => 'nullable|numeric|min:0',
            'public_gantt_chart' => 'nullable|boolean',
            'public_task_board' => 'nullable|boolean',
            'task_approval' => 'nullable|boolean',
            'is_public' => 'nullable|boolean',
            'allow_manual_time_logs' => 'nullable|boolean',
            'enable_miroboard' => 'nullable|boolean',
            'send_task_notification' => 'nullable|boolean',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ];
    }
}
