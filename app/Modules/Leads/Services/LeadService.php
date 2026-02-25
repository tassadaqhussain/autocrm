<?php

declare(strict_types=1);

namespace App\Modules\Leads\Services;

use App\Models\User;
use App\Modules\Deals\Repositories\DealRepository;
use App\Modules\Leads\DTOs\StoreLeadDTO;
use App\Modules\Leads\DTOs\UpdateLeadStatusDTO;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Repositories\LeadRepository;
use Illuminate\Support\Collection;

class LeadService
{
    public function __construct(
        protected LeadRepository $leadRepository,
        protected DealRepository $dealRepository
    ) {}

    public function create(StoreLeadDTO $dto): Lead
    {
        $data = $dto->toArray();
        if (empty($data['counselor_id'])) {
            $data['counselor_id'] = $this->assignRoundRobinCounselor();
        }
        $data['score'] = $this->calculateScore($data);
        $data['status'] = 'New';
        return $this->leadRepository->create($data);
    }

    protected function calculateScore(array $data): int
    {
        $score = 0;
        if (!empty($data['bmi'])) {
            $bmi = (float) $data['bmi'];
            if ($bmi > 30 || $bmi < 18) {
                $score += 20;
            }
        }
        if (!empty($data['urgency']) && $data['urgency'] === 'High') {
            $score += 30;
        }
        if (($data['source'] ?? '') === 'WhatsApp (Meta Ads)') {
            $score += 25;
        }
        return $score;
    }

    public function updateStatus(Lead $lead, UpdateLeadStatusDTO $dto): bool
    {
        return $this->leadRepository->update($lead, ['status' => $dto->status]);
    }

    public function update(Lead $lead, array $data): bool
    {
        return $this->leadRepository->update($lead, $data);
    }

    public function listForIndex(): Collection
    {
        return $this->leadRepository->listForIndex(['campaign', 'counselor']);
    }

    public function getPipelineData(): array
    {
        return [
            'leads' => $this->leadRepository->listForIndex(['campaign', 'counselor']),
            'deals' => $this->dealRepository->getForPipeline(),
        ];
    }

    public function getLeadWithRelations(Lead $lead): Lead
    {
        return $this->leadRepository->loadRelations($lead);
    }

    public function delete(Lead $lead): bool
    {
        return (bool) $this->leadRepository->delete($lead);
    }

    protected function assignRoundRobinCounselor(): ?int
    {
        $counselor = User::where('role', 'Counselor')
            ->withCount(['leads' => function ($query): void {
                $query->where('created_at', '>=', now()->subDay());
            }])
            ->orderBy('leads_count', 'asc')
            ->first();

        return $counselor?->id;
    }
}
