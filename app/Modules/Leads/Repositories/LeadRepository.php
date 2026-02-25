<?php

declare(strict_types=1);

namespace App\Modules\Leads\Repositories;

use App\Modules\Leads\Models\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LeadRepository
{
    public function create(array $data): Lead
    {
        return Lead::create($data);
    }

    public function findById(int $id): ?Lead
    {
        return Lead::find($id);
    }

    public function listForIndex(array $with = []): Collection
    {
        $query = Lead::query()->latest();
        if ($with) {
            $query->with($with);
        }
        return $query->get();
    }

    public function update(Lead $lead, array $data): bool
    {
        return $lead->update($data);
    }

    public function loadRelations(Lead $lead, array $relations = []): Lead
    {
        $default = ['campaign', 'counselor', 'consultation', 'mediaConsent', 'alerts'];
        $lead->load($relations ?: $default);
        return $lead;
    }

    public function delete(Lead $lead): ?bool
    {
        return $lead->delete();
    }
}
