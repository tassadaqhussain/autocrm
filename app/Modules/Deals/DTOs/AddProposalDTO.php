<?php

declare(strict_types=1);

namespace App\Modules\Deals\DTOs;

final readonly class AddProposalDTO
{
    public function __construct(
        public int $clinicId,
        public string $proposalNumber,
        public float $totalAmount,
        public string $proposalDate,
        public string $validUntil,
        public string $status,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'proposal_number' => $this->proposalNumber,
            'total_amount' => $this->totalAmount,
            'proposal_date' => $this->proposalDate,
            'valid_until' => $this->validUntil,
            'status' => $this->status,
        ];
    }
}
