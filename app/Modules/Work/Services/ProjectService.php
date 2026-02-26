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
     * @return Collection<int, Project>
     */
    public function listForIndex(): Collection
    {
        return Project::with(['client', 'milestones', 'tasks'])
            ->where('clinic_id', Auth::user()->clinic_id)
            ->latest()
            ->get();
    }

    public function create(StoreProjectDTO $dto): Project
    {
        return Project::create([
            'clinic_id' => $dto->clinicId,
            'client_id' => $dto->clientId,
            'project_name' => $dto->projectName,
            'description' => $dto->description,
            'start_date' => $dto->startDate,
            'deadline' => $dto->deadline,
            'status' => $dto->status,
            'budget' => $dto->budget,
        ]);
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
