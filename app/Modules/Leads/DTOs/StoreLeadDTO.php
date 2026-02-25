<?php

declare(strict_types=1);

namespace App\Modules\Leads\DTOs;

final readonly class StoreLeadDTO
{
    public function __construct(
        public int $clinicId,
        public string $name,
        public string $phone,
        public string $source,
        public ?int $campaignId,
        public ?int $counselorId,
        public ?float $bmi,
        public ?string $healthInfo,
        public ?string $urgency,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'name' => $this->name,
            'phone' => $this->phone,
            'source' => $this->source,
            'campaign_id' => $this->campaignId,
            'counselor_id' => $this->counselorId,
            'bmi' => $this->bmi,
            'health_info' => $this->healthInfo,
            'urgency' => $this->urgency,
        ];
    }
}
