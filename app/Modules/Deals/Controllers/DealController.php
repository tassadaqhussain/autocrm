<?php

declare(strict_types=1);

namespace App\Modules\Deals\Controllers;

/**
 * Deals module controller. Flow: Request → FormRequest validation → authorize() → build DTO → DealService → redirect/response.
 * No business logic, no direct Eloquent. All persistence via DealService → DealRepository.
 */
use App\Modules\Deals\DTOs\AddFollowUpDTO;
use App\Modules\Deals\DTOs\AddNoteDTO;
use App\Modules\Deals\DTOs\AddProposalDTO;
use App\Modules\Deals\DTOs\StoreDealDTO;
use App\Modules\Deals\DTOs\UpdateDealStageDTO;
use App\Modules\Deals\Models\Deal;
use App\Modules\Deals\Models\DealFile;
use App\Modules\Deals\Models\DealProposal;
use App\Modules\Deals\Models\DealProposalFile;
use App\Modules\Deals\Requests\AddFollowUpRequest;
use App\Modules\Deals\Requests\AddNoteRequest;
use App\Modules\Deals\Requests\AddProposalRequest;
use App\Modules\Deals\Requests\StoreAgentRequest;
use App\Modules\Deals\Requests\StoreCategoryRequest;
use App\Modules\Deals\Requests\StoreDealRequest;
use App\Modules\Deals\Requests\UpdateDealStageRequest;
use App\Modules\Deals\Requests\UploadDealFilesRequest;
use App\Modules\Deals\Requests\UploadProposalFilesRequest;
use App\Modules\Deals\Services\DealService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected DealService $dealService
    ) {}

    public function show(Deal $deal): Response
    {
        $this->authorize('view', $deal);
        $deal = $this->dealService->getDealWithRelations($deal);
        return Inertia::render('Deals/Show', [
            'deal' => $deal,
        ]);
    }

    public function store(StoreDealRequest $request): RedirectResponse
    {
        $this->authorize('create', Deal::class);
        $data = $request->validated();
        $data['agent_id'] = $data['agent_id'] ?? null;
        $data['watcher_id'] = $data['watcher_id'] ?? null;
        $data['lead_id'] = (int) $data['lead_id'];
        $dto = new StoreDealDTO(
            clinicId: (int) Auth::user()->clinic_id,
            leadId: $data['lead_id'],
            name: $data['name'],
            pipeline: $data['pipeline'],
            stage: $data['stage'],
            value: (float) $data['value'],
            closeDate: $data['close_date'],
            category: $data['category'] ?? null,
            agentId: $data['agent_id'] ? (int) $data['agent_id'] : null,
            watcherId: $data['watcher_id'] ? (int) $data['watcher_id'] : null,
            productIds: $data['product_ids'] ?? null,
        );
        $this->dealService->createDeal($dto);
        return back()->with('success', 'Deal created successfully.');
    }

    public function updateStage(UpdateDealStageRequest $request, Deal $deal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $dto = new UpdateDealStageDTO(stage: $request->validated()['stage']);
        $this->dealService->updateStage($deal, $dto);
        return back()->with('success', 'Deal stage updated.');
    }

    public function quickStoreCategory(StoreCategoryRequest $request): RedirectResponse
    {
        $this->authorize('create', Deal::class);
        $this->dealService->quickStoreCategory($request->validated()['name']);
        return back()->with('success', 'Category added.');
    }

    public function quickStoreAgent(StoreAgentRequest $request): RedirectResponse
    {
        $this->authorize('create', Deal::class);
        $this->dealService->quickStoreAgent($request->validated()['name']);
        return back()->with('success', 'Agent added.');
    }

    public function addFollowUp(AddFollowUpRequest $request, Deal $deal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $v = $request->validated();
        $dto = new AddFollowUpDTO(
            clinicId: (int) Auth::user()->clinic_id,
            nextFollowUpDate: $v['next_follow_up_date'],
            startTime: $v['start_time'],
            sendReminder: $request->boolean('send_reminder'),
            remark: $v['remark'] ?? null,
            status: $v['status'],
        );
        $this->dealService->addFollowUp($deal, $dto);
        return back()->with('success', 'Follow up added.');
    }

    public function addNote(AddNoteRequest $request, Deal $deal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $dto = new AddNoteDTO(
            clinicId: (int) Auth::user()->clinic_id,
            detail: $request->validated()['detail'],
        );
        $this->dealService->addNote($deal, $dto);
        return back()->with('success', 'Note added.');
    }

    public function addProposal(AddProposalRequest $request, Deal $deal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $v = $request->validated();
        $dto = new AddProposalDTO(
            clinicId: (int) Auth::user()->clinic_id,
            proposalNumber: $v['proposal_number'],
            totalAmount: (float) $v['total_amount'],
            proposalDate: $v['proposal_date'],
            validUntil: $v['valid_until'],
            status: $v['status'],
        );
        $this->dealService->addProposal($deal, $dto);
        return back()->with('success', 'Proposal added.');
    }

    public function uploadFile(UploadDealFilesRequest $request, Deal $deal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $this->dealService->uploadDealFiles($request, $deal, 'public');
        return back()->with('success', 'File(s) uploaded successfully.');
    }

    public function destroyFile(Deal $deal, DealFile $file): RedirectResponse
    {
        $this->authorize('update', $deal);
        $this->dealService->deleteDealFile($file, $deal, 'public');
        return back()->with('success', 'File deleted successfully.');
    }

    public function uploadProposalFile(UploadProposalFilesRequest $request, Deal $deal, DealProposal $proposal): RedirectResponse
    {
        $this->authorize('update', $deal);
        $this->dealService->uploadProposalFiles($request, $deal, $proposal, 'public');
        return back()->with('success', 'File(s) uploaded successfully.');
    }

    public function destroyProposalFile(Deal $deal, DealProposal $proposal, DealProposalFile $file): RedirectResponse
    {
        $this->authorize('update', $deal);
        $this->dealService->deleteProposalFile($deal, $proposal, $file, 'public');
        return back()->with('success', 'File deleted successfully.');
    }
}
