<?php

declare(strict_types=1);

namespace App\Modules\Deals\Repositories;

use App\Modules\Deals\Models\Deal;
use App\Modules\Deals\Models\DealCategory;
use App\Modules\Deals\Models\DealFollowUp;
use App\Modules\Deals\Models\DealNote;
use App\Modules\Deals\Models\DealProposal;
use Illuminate\Database\Eloquent\Collection;

class DealRepository
{
    public function create(array $data): Deal
    {
        return Deal::create($data);
    }

    public function findById(int $id): ?Deal
    {
        return Deal::find($id);
    }

    public function getForPipeline(): Collection
    {
        return Deal::with(['lead', 'agent', 'watcher'])->latest()->get();
    }

    public function update(Deal $deal, array $data): bool
    {
        return $deal->update($data);
    }

    public function loadRelations(Deal $deal, array $relations = []): Deal
    {
        $default = ['lead', 'agent', 'watcher', 'followUps', 'proposals.files', 'notes', 'files'];
        $deal->load($relations ?: $default);
        return $deal;
    }

    public function createFollowUp(Deal $deal, array $data): DealFollowUp
    {
        return $deal->followUps()->create($data);
    }

    public function createNote(Deal $deal, array $data): DealNote
    {
        return $deal->notes()->create($data);
    }

    public function createProposal(Deal $deal, array $data): DealProposal
    {
        return $deal->proposals()->create($data);
    }

    public function createCategory(array $data): DealCategory
    {
        return DealCategory::create($data);
    }
}
