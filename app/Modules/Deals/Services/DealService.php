<?php

declare(strict_types=1);

namespace App\Modules\Deals\Services;

use App\Models\User;
use App\Modules\Deals\DTOs\AddFollowUpDTO;
use App\Modules\Deals\DTOs\AddNoteDTO;
use App\Modules\Deals\DTOs\AddProposalDTO;
use App\Modules\Deals\DTOs\StoreDealDTO;
use App\Modules\Deals\DTOs\UpdateDealStageDTO;
use App\Modules\Deals\Models\Deal;
use App\Modules\Deals\Models\DealFile;
use App\Modules\Deals\Models\DealProposal;
use App\Modules\Deals\Models\DealProposalFile;
use App\Modules\Deals\Repositories\DealRepository;
use App\Support\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DealService
{
    public function __construct(
        protected DealRepository $dealRepository,
        protected FileUploadService $fileUpload
    ) {}

    public function createDeal(StoreDealDTO $dto): Deal
    {
        return $this->dealRepository->create($dto->toArray());
    }

    public function updateStage(Deal $deal, UpdateDealStageDTO $dto): bool
    {
        return $this->dealRepository->update($deal, ['stage' => $dto->stage]);
    }

    public function addFollowUp(Deal $deal, AddFollowUpDTO $dto): void
    {
        $this->dealRepository->createFollowUp($deal, $dto->toArray());
    }

    public function addNote(Deal $deal, AddNoteDTO $dto): void
    {
        $this->dealRepository->createNote($deal, $dto->toArray());
    }

    public function addProposal(Deal $deal, AddProposalDTO $dto): void
    {
        $this->dealRepository->createProposal($deal, $dto->toArray());
    }

    public function getDealWithRelations(Deal $deal): Deal
    {
        return $this->dealRepository->loadRelations($deal);
    }

    public function getForPipeline(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->dealRepository->getForPipeline();
    }

    public function quickStoreCategory(string $name): void
    {
        $this->dealRepository->createCategory([
            'name' => $name,
            'clinic_id' => Auth::id() ? Auth::user()->clinic_id : null,
        ]);
    }

    public function quickStoreAgent(string $name): void
    {
        User::create([
            'name' => $name,
            'email' => strtolower(str_replace(' ', '.', $name)) . rand(100, 999) . '@system.com',
            'password' => bcrypt('password'),
            'role' => 'Counselor',
            'clinic_id' => Auth::user()->clinic_id,
        ]);
    }

    public function uploadDealFiles(Request $request, Deal $deal, string $disk = 'public'): int
    {
        return $this->fileUpload->upload(
            $request,
            'deals/' . $deal->id,
            $deal,
            'files',
            ['clinic_id' => Auth::user()->clinic_id],
            $disk
        );
    }

    public function deleteDealFile(DealFile $file, Deal $deal, string $disk = 'public'): void
    {
        if ($file->deal_id !== $deal->id) {
            abort(404);
        }
        $this->fileUpload->deleteFile($file, $disk);
    }

    public function uploadProposalFiles(Request $request, Deal $deal, DealProposal $proposal, string $disk = 'public'): int
    {
        if ($proposal->deal_id !== $deal->id) {
            abort(404);
        }
        return $this->fileUpload->upload(
            $request,
            'proposals/' . $proposal->id,
            $proposal,
            'files',
            ['clinic_id' => Auth::user()->clinic_id],
            $disk
        );
    }

    public function deleteProposalFile(Deal $deal, DealProposal $proposal, DealProposalFile $file, string $disk = 'public'): void
    {
        if ($proposal->deal_id !== $deal->id || $file->deal_proposal_id !== $proposal->id) {
            abort(404);
        }
        $this->fileUpload->deleteFile($file, $disk);
    }
}
