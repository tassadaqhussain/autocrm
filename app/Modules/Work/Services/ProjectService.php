<?php

declare(strict_types=1);

namespace App\Modules\Work\Services;

use App\Modules\Work\Models\Project;
use App\Modules\Work\DTOs\StoreProjectDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    /**
     * @param array $filters
     * @return Collection<int, Project>
     */
    public function listForIndex(array $filters = []): Collection
    {
        $query = Project::with(['client', 'category', 'members'])
            ->where('clinic_id', Auth::user()->clinic_id);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('project_name', 'like', "%{$search}%")
                    ->orWhere('short_code', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        return $query->latest()->get();
    }

    public function create(StoreProjectDTO $dto): Project
    {
        $project = Project::create([
            'clinic_id' => $dto->clinicId,
            'client_id' => $dto->clientId,
            'project_name' => $dto->projectName,
            'short_code' => $dto->shortCode,
            'category_id' => $dto->categoryId,
            'department_id' => $dto->departmentId,
            'description' => $dto->description,
            'summary' => $dto->summary,
            'notes' => $dto->notes,
            'start_date' => $dto->startDate,
            'deadline' => $dto->deadline,
            'no_deadline' => $dto->noDeadline,
            'status' => $dto->status,
            'budget' => $dto->budget,
            'currency' => $dto->currency,
            'hours_estimate' => $dto->hoursEstimate,
            'public_gantt_chart' => $dto->publicGanttChart,
            'public_task_board' => $dto->publicTaskBoard,
            'task_approval' => $dto->taskApproval,
            'is_public' => $dto->isPublic,
            'allow_manual_time_logs' => $dto->allowManualTimeLogs,
            'enable_miroboard' => $dto->enableMiroboard,
            'send_task_notification' => $dto->sendTaskNotification,
        ]);

        if (!empty($dto->memberIds)) {
            $project->members()->sync($dto->memberIds);
        }

        return $project;
    }

    public function update(Project $project, array $data): bool
    {
        return $project->update($data);
    }

    public function delete(Project $project): bool
    {
        return (bool) $project->delete();
    }
}
