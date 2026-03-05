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

        $projects = $this->projectService->listForIndex();

        // Following Pattern: Include client list for creation/filtering
        $clients = Client::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Work/Projects/Index', [
            'projects' => $projects,
            'clients' => $clients,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $v = $request->validated();

        $dto = new StoreProjectDTO(
            clinicId: (int) Auth::user()->clinic_id,
            projectName: $v['project_name'],
            clientId: isset($v['client_id']) ? (int) $v['client_id'] : null,
            description: $v['description'] ?? null,
            startDate: $v['start_date'] ?? null,
            deadline: $v['deadline'] ?? null,
            status: $v['status'],
            budget: (float) ($v['budget'] ?? 0.0),
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
