<?php

declare(strict_types=1);

namespace App\Modules\Leads\Controllers;

use App\Models\Campaign;
use App\Models\User;
use App\Modules\Deals\Models\DealCategory;
use App\Modules\Deals\Models\Product;
use App\Modules\Leads\DTOs\StoreLeadDTO;
use App\Modules\Leads\DTOs\UpdateLeadStatusDTO;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Requests\StoreLeadRequest;
use App\Modules\Leads\Requests\UpdateLeadRequest;
use App\Modules\Leads\Requests\UpdateLeadStatusRequest;
use App\Modules\Leads\Services\LeadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        protected LeadService $leadService
    ) {}

    public function index(Request $request): Response
    {
        $view = $request->get('view', 'list');

        if ($view === 'pipeline') {
            return $this->pipeline();
        }

        $data = $this->leadService->listForIndex();
        return Inertia::render('Leads/Index', [
            'leads' => $data,
            'campaigns' => Campaign::all(),
            'counselors' => User::where('role', 'Counselor')->get(),
        ]);
    }

    public function pipeline(): Response
    {
        $pipeline = $this->leadService->getPipelineData();
        return Inertia::render('Leads/Pipeline', [
            'leads' => $pipeline['leads'],
            'deals' => $pipeline['deals'],
            'campaigns' => Campaign::all(),
            'counselors' => User::where('role', 'Counselor')->get(),
            'products' => Product::all(),
            'categories' => DealCategory::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Lead::class);
        return Inertia::render('Leads/Create', [
            'campaigns' => Campaign::all(),
            'counselors' => User::where('role', 'Counselor')->get(),
        ]);
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $this->authorize('create', Lead::class);
        $v = $request->validated();
        $dto = new StoreLeadDTO(
            clinicId: (int) Auth::user()->clinic_id,
            name: $v['name'],
            phone: $v['phone'],
            source: $v['source'],
            campaignId: isset($v['campaign_id']) ? (int) $v['campaign_id'] : null,
            counselorId: isset($v['counselor_id']) && $v['counselor_id'] ? (int) $v['counselor_id'] : null,
            bmi: isset($v['bmi']) ? (float) $v['bmi'] : null,
            healthInfo: $v['health_info'] ?? null,
            urgency: $v['urgency'] ?? null,
        );
        $this->leadService->create($dto);
        return redirect()->route('leads.index')->with('success', 'Lead created successfully.');
    }

    public function show(Lead $lead): Response
    {
        $this->authorize('view', $lead);
        $lead = $this->leadService->getLeadWithRelations($lead);
        return Inertia::render('Leads/Show', [
            'lead' => $lead,
            'counselors' => User::where('role', 'Counselor')->get(),
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);
        $this->leadService->update($lead, $request->validated());
        return back()->with('success', 'Lead updated.');
    }

    public function updateStatus(UpdateLeadStatusRequest $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);
        $dto = new UpdateLeadStatusDTO(status: $request->validated()['status']);
        $this->leadService->updateStatus($lead, $dto);
        return back()->with('success', 'Lead status updated.');
    }

    public function edit(Lead $lead): RedirectResponse|Response
    {
        $this->authorize('update', $lead);
        return redirect()->route('leads.show', $lead);
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $this->authorize('delete', $lead);
        $this->leadService->delete($lead);
        return redirect()->route('leads.index')->with('success', 'Lead deleted.');
    }
}
