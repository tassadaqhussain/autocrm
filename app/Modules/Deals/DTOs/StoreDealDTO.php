<?php

declare(strict_types=1);

namespace App\Modules\Deals\DTOs;

final readonly class StoreDealDTO
{
    public function __construct(
        public int $clinicId,
        public int $leadId,
        public string $name,
        public string $pipeline,
        public string $stage,
        public float $value,
        public string $closeDate,
        public ?string $category,
        public ?int $agentId,
        public ?int $watcherId,
        public ?array $productIds,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'lead_id' => $this->leadId,
            'name' => $this->name,
            'pipeline' => $this->pipeline,
            'stage' => $this->stage,
            'value' => $this->value,
            'close_date' => $this->closeDate,
            'category' => $this->category,
            'agent_id' => $this->agentId,
            'watcher_id' => $this->watcherId,
            'product_ids' => $this->productIds,
        ];
    }
}
