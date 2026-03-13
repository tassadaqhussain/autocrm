<?php

declare(strict_types=1);

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\Project;
use App\Modules\Work\Services\ProjectService;
use App\Modules\Work\Requests\StoreProjectRequest;
use App\Modules\Work\DTOs\StoreProjectDTO;
use App\Modules\Clients\Models\Client;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected ProjectService $projectService
    ) {
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $projects = $this->projectService->listForIndex($request->all());
        $clinicId = Auth::user()->clinic_id;

        $clients = Client::where('clinic_id', $clinicId)->select('id', 'name')->get();
        $categories = \App\Modules\Work\Models\ProjectCategory::where('clinic_id', $clinicId)->get();
        $departments = \App\Models\HR\Department::where('clinic_id', $clinicId)->get();
        $users = \App\Models\User::where('clinic_id', $clinicId)->select('id', 'name')->get();

        return Inertia::render('Work/Projects/Index', [
            'projects' => $projects,
            'clients' => $clients,
            'categories' => $categories,
            'departments' => $departments,
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'category_id', 'client_id']),
        ]);
    }

    public function templates(): Response
    {
        $this->authorize('viewAny', Project::class);

        return Inertia::render('Work/Projects/Templates', [
            // Potentially fetch project templates here in the future
            'templates' => [],
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $v = $request->validated();

        $dto = new StoreProjectDTO(
            clinicId: (int) Auth::user()->clinic_id,
            projectName: $v['project_name'],
            shortCode: $v['short_code'] ?? null,
            clientId: isset($v['client_id']) ? (int) $v['client_id'] : null,
            categoryId: isset($v['category_id']) ? (int) $v['category_id'] : null,
            departmentId: isset($v['department_id']) ? (int) $v['department_id'] : null,
            description: $v['description'] ?? null,
            summary: $v['summary'] ?? null,
            notes: $v['notes'] ?? null,
            startDate: $v['start_date'] ?? null,
            deadline: $v['deadline'] ?? null,
            noDeadline: (bool) ($v['no_deadline'] ?? false),
            status: $v['status'],
            budget: (float) ($v['budget'] ?? 0.0),
            currency: $v['currency'] ?? 'SAR',
            hoursEstimate: isset($v['hours_estimate']) ? (float) $v['hours_estimate'] : null,
            publicGanttChart: (bool) ($v['public_gantt_chart'] ?? false),
            publicTaskBoard: (bool) ($v['public_task_board'] ?? false),
            taskApproval: (bool) ($v['task_approval'] ?? false),
            isPublic: (bool) ($v['is_public'] ?? false),
            allowManualTimeLogs: (bool) ($v['allow_manual_time_logs'] ?? false),
            enableMiroboard: (bool) ($v['enable_miroboard'] ?? false),
            sendTaskNotification: (bool) ($v['send_task_notification'] ?? false),
            memberIds: $v['member_ids'] ?? [],
        );

        $this->projectService->create($dto);

        return back()->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        // For brevity using raw update here, but could use StoreProjectRequest validation
        $this->projectService->update($project, $request->all());
        return back()->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->delete($project);
        return back()->with('success', 'Project deleted.');
    }
}
